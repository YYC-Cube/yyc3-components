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

export interface FamilySignal<T = unknown> {
  id: string;
  type: SignalType;
  from: string;
  to?: string;
  payload: T;
  timestamp: Date;
  requiresAck?: boolean;
}

export interface SignalResponse<T = unknown> {
  id: string;
  signalId: string;
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
