/**
 * Protocol Types
 * 通信协议类型定义
 */

export type SignalType = 
  | 'heartbeat'
  | 'message'
  | 'command'
  | 'response'
  | 'error'
  | 'status';

export interface FamilySignal {
  id: string;
  type: SignalType;
  from: string;
  to?: string;
  payload: any;
  timestamp: Date;
  requiresAck?: boolean;
}

export interface SignalResponse {
  id: string;
  signalId: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
}
