export function getApiBaseUrl(): string {
  return 'http://localhost:3200/api';
}

export function getWsBaseUrl(): string {
  return 'ws://localhost:3200/ws';
}

export function readConfigSnapshot(): Record<string, unknown> {
  return {};
}
