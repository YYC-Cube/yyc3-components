export const workflow = {
  enabled: true,
  maxConcurrent: 5,
  stepTimeout: 30000,
  retryMax: 3,
  retryDelay: 1000,
  enableLogging: true,
  enableMetrics: true,
  creation: {
    requireApproval: true,
    autoAdvance: true,
  },
};
