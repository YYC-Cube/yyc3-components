export function useDocker() {
  return {
    containers: [],
    loading: false,
    error: null,
    isHealthy: true,
    metrics: {
      totalContainers: 0,
      runningContainers: 0,
      stoppedContainers: 0,
    },
    refresh: async () => {},
    startContainer: async (_id: string) => {},
    stopContainer: async (_id: string) => {},
    removeContainer: async (_id: string) => {},
  };
}
