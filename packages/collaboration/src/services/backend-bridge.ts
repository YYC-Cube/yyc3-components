export type ConnectionState =
  | 'MOCK_MODE'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'RECONNECTING'
  | 'ERROR';

export type ConnectionStatus = {
  state: ConnectionState;
  latency: number;
};

export function getBackendBridge(): {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  send: (data: unknown) => void;
  dispatchSignal: (signal: unknown) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => () => void;
  off: (event: string, callback: (...args: unknown[]) => void) => void;
  getState: () => ConnectionState;
  status: ConnectionStatus;
  isConnected: boolean;
  isMockMode: boolean;
} {
  return {
    connect: async () => {},
    disconnect: async () => {},
    send: () => {},
    dispatchSignal: () => {},
    on: () => () => {},
    off: () => {},
    getState: () => 'DISCONNECTED',
    status: { state: 'DISCONNECTED', latency: 0 },
    isConnected: false,
    isMockMode: false,
  };
}
