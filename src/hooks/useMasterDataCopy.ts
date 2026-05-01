/**
 * No-op hook — master data copy system has been removed.
 * Each user now starts with empty data sections.
 */
export const useMasterDataCopy = (_userId: string | undefined) => {
  return true;
};
