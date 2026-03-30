import type { NetworkConfig, DynamicConfig } from '../types/dynamic-config';

export function getApiBaseUrl(): string {
  return 'http://localhost:3200/api';
}

export function getWsBaseUrl(): string {
  return 'ws://localhost:3200/ws';
}

export function readConfigSnapshot(): Partial<DynamicConfig> | null {
  // Return null to indicate no config snapshot available
  // Will use default values in buildDefaultConfig
  return null;
}
