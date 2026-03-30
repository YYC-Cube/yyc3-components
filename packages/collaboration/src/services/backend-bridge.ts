export interface ConnectionState {
  connected: boolean;
  url: string | null;
  reconnecting: boolean;
}

export function getBackendBridge(): {
  send: (data: unknown) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback: (...args: unknown[]) => void) => void;
  getState: () => ConnectionState;
} {
  return {
    send: () => {},
    on: () => {},
    off: () => {},
    getState: () => ({ connected: false, url: null, reconnecting: false }),
  };
}
