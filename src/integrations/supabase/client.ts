import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes 
} from 'firebase/storage';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { db, auth, storage as firebaseStorage } from '../firebase';

export type Database = any;

class FirebaseQueryBuilder {
  private tableName: string;
  private filters: Array<{ field: string; value: any }> = [];
  private orderFields: Array<{ field: string; ascending: boolean }> = [];
  private mutationData: any = null;
  private mutationType: 'insert' | 'update' | 'delete' | null = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns?: string, options?: any) {
    // Columns filtering/specification is ignored since client filters properties manually if needed
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push({ field, value });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderFields.push({ field, ascending: options?.ascending !== false });
    return this;
  }

  insert(data: any) {
    this.mutationType = 'insert';
    this.mutationData = data;
    return this;
  }

  update(data: any) {
    this.mutationType = 'update';
    this.mutationData = data;
    return this;
  }

  delete() {
    this.mutationType = 'delete';
    return this;
  }

  private async executeMutation(): Promise<any[]> {
    const colRef = collection(db, this.tableName);
    if (this.mutationType === 'insert') {
      const isArray = Array.isArray(this.mutationData);
      const items = isArray ? this.mutationData : [this.mutationData];
      const results: any[] = [];

      for (const item of items) {
        // Generate document reference
        const docRef = item.id ? doc(db, this.tableName, item.id) : doc(colRef);
        const record = {
          ...item,
          id: docRef.id,
          created_at: item.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await setDoc(docRef, record);
        results.push(record);
      }
      return results;
    }

    if (this.mutationType === 'update' || this.mutationType === 'delete') {
      // Find matching docs first
      const fetchBuilder = new FirebaseQueryBuilder(this.tableName);
      fetchBuilder.filters = [...this.filters];
      const { data: matchingDocs } = await fetchBuilder.executeSelect();
      if (!matchingDocs) return [];

      const results: any[] = [];
      for (const docData of matchingDocs) {
        const docRef = doc(db, this.tableName, docData.id);
        if (this.mutationType === 'update') {
          const updatedRecord = {
            ...docData,
            ...this.mutationData,
            updated_at: new Date().toISOString()
          };
          // Use setDoc merge true to ensure fields are merged/created correctly
          await setDoc(docRef, updatedRecord, { merge: true });
          results.push(updatedRecord);
        } else {
          await deleteDoc(docRef);
          results.push(docData);
        }
      }
      return results;
    }

    return [];
  }

  private async executeSelect(): Promise<{ data: any[] | null; error: any }> {
    try {
      const colRef = collection(db, this.tableName);
      
      // Try to optimize query by user_id filter if it is in filters
      const userIdFilter = this.filters.find(f => f.field === 'user_id');
      let snapshot;
      if (userIdFilter) {
        const q = query(colRef, where('user_id', '==', userIdFilter.value));
        snapshot = await getDocs(q);
      } else {
        snapshot = await getDocs(colRef);
      }

      let docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      // Apply other filters locally
      for (const filter of this.filters) {
        if (filter.field === 'user_id' && userIdFilter) continue; // already filtered
        docs = docs.filter((item: any) => item[filter.field] === filter.value);
      }

      // Apply sorting locally
      for (const sort of this.orderFields) {
        docs.sort((a: any, b: any) => {
          const valA = a[sort.field];
          const valB = b[sort.field];
          if (valA === valB) return 0;
          if (valA == null) return 1;
          if (valB == null) return -1;
          const comparison = valA < valB ? -1 : 1;
          return sort.ascending ? comparison : -comparison;
        });
      }

      return { data: docs, error: null };
    } catch (err: any) {
      console.error(`Select query error for ${this.tableName}:`, err);
      return { data: null, error: err };
    }
  }

  // Promise-like then method so users can await the query builder directly
  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    let result;
    if (this.mutationType) {
      try {
        const res = await this.executeMutation();
        result = { data: Array.isArray(this.mutationData) ? res : res[0], error: null };
      } catch (err: any) {
        result = { data: null, error: err };
      }
    } else {
      result = await this.executeSelect();
    }
    
    if (onfulfilled) return onfulfilled(result);
    return result;
  }

  async single() {
    let data = null;
    let error = null;
    if (this.mutationType) {
      try {
        const res = await this.executeMutation();
        data = res[0] || null;
      } catch (err: any) {
        error = err;
      }
    } else {
      const res = await this.executeSelect();
      data = res.data && res.data.length > 0 ? res.data[0] : null;
      error = res.error;
    }
    if (!data && !error) {
      error = new Error('No rows found');
    }
    return { data, error };
  }

  async maybeSingle() {
    let data = null;
    let error = null;
    if (this.mutationType) {
      try {
        const res = await this.executeMutation();
        data = res[0] || null;
      } catch (err: any) {
        error = err;
      }
    } else {
      const res = await this.executeSelect();
      data = res.data && res.data.length > 0 ? res.data[0] : null;
      error = res.error;
    }
    return { data, error };
  }
}

export const supabase = {
  from(tableName: string) {
    return new FirebaseQueryBuilder(tableName);
  },

  auth: {
    onAuthStateChange(callback: (event: string, session: any) => void) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const session = {
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email,
            },
            access_token: 'dummy-token',
          };
          callback('SIGNED_IN', session);
        } else {
          callback('SIGNED_OUT', null);
        }
      });
      return {
        data: {
          subscription: {
            unsubscribe
          }
        }
      };
    },

    async getSession() {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        return {
          data: {
            session: {
              user: {
                id: firebaseUser.uid,
                email: firebaseUser.email,
              }
            }
          },
          error: null
        };
      }
      return { data: { session: null }, error: null };
    },

    async signUp({ email, password }: any) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return {
          data: {
            user: {
              id: userCredential.user.uid,
              email: userCredential.user.email,
            }
          },
          error: null
        };
      } catch (error: any) {
        return { data: { user: null }, error };
      }
    },

    async signInWithPassword({ email, password }: any) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
          data: {
            user: {
              id: userCredential.user.uid,
              email: userCredential.user.email,
            }
          },
          error: null
        };
      } catch (error: any) {
        return { data: { user: null }, error };
      }
    },

    async signOut() {
      try {
        await firebaseSignOut(auth);
        return { error: null };
      } catch (error: any) {
        return { error };
      }
    },

    async resetPasswordForEmail(email: string, options?: any) {
      try {
        await sendPasswordResetEmail(auth, email);
        return { error: null };
      } catch (error: any) {
        return { error };
      }
    }
  },

  storage: {
    from(bucketName: string) {
      return {
        async upload(path: string, file: File, options?: any) {
          try {
            const storageRef = ref(firebaseStorage, path);
            const snapshot = await uploadBytes(storageRef, file);
            return { data: snapshot, error: null };
          } catch (error: any) {
            return { data: null, error };
          }
        },

        getPublicUrl(path: string) {
          const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '';
          const encodedPath = encodeURIComponent(path);
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
          return {
            data: {
              publicUrl
            }
          };
        }
      };
    }
  }
};