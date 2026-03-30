export interface WebSocketState {
  connected: boolean;
  reconnecting: boolean;
  url: string | null;
}

export interface WebSocketConnectionInfo {
  url: string;
  protocol: string;
  connectedAt: string | null;
}

export interface WebSocketStatistics {
  messagesSent: number;
  messagesReceived: number;
  bytesSent: number;
  bytesReceived: number;
  uptime: number;
}
