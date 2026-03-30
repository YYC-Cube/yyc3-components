export type { ConnectionState, BackendMessage, ConnectionStatus } from '../services/backend-bridge';

export type BridgeConfig = import('../services/backend-bridge').BackendConfig;

export interface BridgeEvent {
  type: 'connection_change' | 'signal_received' | 'member_update' | 'system_event' | 'error' | 'heartbeat';
  data: unknown;
  timestamp: number;
}

export interface ConnectionStats {
  totalConnections: number;
  successfulConnections: number;
  failedConnections: number;
  averageLatency: number;
  messagesSent: number;
  messagesReceived: number;
  lastConnectedAt: number;
  uptime: number;
}

export interface UseBackendBridgeReturn {
  connectionState: import('../services/backend-bridge').ConnectionState;
  connectionStatus: import('../services/backend-bridge').ConnectionStatus | null;
  stats: ConnectionStats;
  isConnected: boolean;
  isMockMode: boolean;
  connect: () => void;
  disconnect: () => void;
  sendCommand: (type: string, payload: unknown) => void;
  on: (event: string, callback: (data: unknown) => void) => () => void;
}
