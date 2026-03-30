/**
 * Dynamic Config Types
 * 动态配置类型定义
 */

export interface NetworkConfig {
  wsUrl: string;
  apiUrl: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  connectionTimeout: number;
  agentCallTimeout: number;
  maxReconnectDelay: number;
  backoffMultiplier: number;
}

export interface DynamicConfig {
  network: NetworkConfig;
  features: Record<string, boolean>;
  version: string;
  lastUpdated: Date;
}

export type ConfigSnapshot = Partial<DynamicConfig>;
