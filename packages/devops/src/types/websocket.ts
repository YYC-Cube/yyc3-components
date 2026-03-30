export type WebSocketState =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'failed'
  | 'reconnecting'
  | 'closed';

export interface WebSocketConnectionInfo {
  url: string;
  protocol: string;
  connectedAt: string | null;
  lastConnectedAt?: string | null;
  serverUrl?: string;
  connectedDuration?: number;
  lastError?: string;
  reconnectAttempts?: number;
}

export interface WebSocketStatistics {
  messagesSent: number;
  messagesReceived: number;
  bytesSent: number;
  bytesReceived: number;
  uptime: number;
  errorCount?: number;
  averageLatency?: number;
}
