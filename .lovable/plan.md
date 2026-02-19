

## Make the Platform Individual Per User

### Goal
Each user gets their own independent profile with empty data sections on signup. They must input their own values. The sidebar navigation stays the same. `ramesraja.kn@gmail.com` will be the admin.

### What Changes

**1. Remove Master Data Copy System**
- Remove the `useMasterDataCopy` hook call from `Dashboard.tsx`
- Remove/disable the `useMasterDataCopy.ts` hook file (replace with empty hook)
- Remove the "Reset to master" button from `UsersTab.tsx`
- The `copy-master-data` edge function can be left in place but will no longer be called

**2. Update Admin Assignment**
- Remove the hardcoded `MASTER_ACCOUNT_ID` from `useAdmin.ts` (no longer relevant)
- Keep the admin check logic via `user_roles` table (already works correctly)
- On signup, when the email is `ramesraja.kn@gmail.com`, assign the `admin` role instead of `user`

**3. Update Signup Flow (AuthContext.tsx)**
- Stop copying master profile fields (company_name, logo, banner, summary) -- this is already not done directly in signup, it happens via the edge function hook
- Assign `admin` role to `ramesraja.kn@gmail.com`, `user` role to everyone else
- Auto-approve the admin account (`is_approved: true`), other users start as `is_approved: false` (current behavior)

**4. Update UsersTab.tsx**
- Remove the "Reset to master" / "Restore" button since there's no master data concept
- Remove references to `MASTER_ACCOUNT_ID` and "Master" badges
- Keep Approve/Revoke and Remove functionality

**5. Remove master account references from AuthContext.tsx**
- Remove the unused `MASTER_ACCOUNT_ID` constant on line 6

### Technical Details

**Files to modify:**
- `src/hooks/useAdmin.ts` -- Remove `MASTER_ACCOUNT_ID` export
- `src/hooks/useMasterDataCopy.ts` -- Gut the hook to just return `true` (no-op)
- `src/pages/Dashboard.tsx` -- Remove `useMasterDataCopy` import and call
- `src/contexts/AuthContext.tsx` -- Remove master account ID constant; add admin role assignment for `ramesraja.kn@gmail.com`
- `src/components/dashboard/UsersTab.tsx` -- Remove "Reset to master" button, remove Master badge, remove `MASTER_ACCOUNT_ID` references

**No database changes needed** -- the existing `user_roles` table and RLS policies already support this model.

