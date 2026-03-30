export function useDocker() {
  return {
    containers: [],
    loading: false,
    error: null,
    refresh: async () => {},
    startContainer: async (_id: string) => {},
    stopContainer: async (_id: string) => {},
    removeContainer: async (_id: string) => {},
  };
}
