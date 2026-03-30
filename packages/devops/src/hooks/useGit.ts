export function useGit() {
  return {
    status: null,
    branches: [],
    loading: false,
    error: null,
    refresh: async () => {},
    commit: async (_options: { message: string }) => {},
    push: async () => {},
    pull: async () => {},
    checkout: async (_branch: string) => {},
  };
}
