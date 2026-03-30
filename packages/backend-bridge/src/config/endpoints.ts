/**
 * API Endpoints Configuration
 * API 端点配置
 */

export const ENDPOINTS = {
  HEALTH: '/health',
  MEMBERS: '/api/members',
  MEMBER_DETAIL: (id: string) => `/api/members/${id}`,
  CONFIG: '/api/config',
  SIGNAL: '/api/signal',
  AUTH: '/api/auth',
  PERMISSIONS: '/api/permissions',
} as const;

export type Endpoint = typeof ENDPOINTS[keyof typeof ENDPOINTS];
