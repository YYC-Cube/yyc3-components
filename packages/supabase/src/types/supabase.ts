export interface SupabaseConfig {
  projectId: string;
  publicAnonKey: string;
  serverUrl: string;
}

export type SupabaseSyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

export interface SupabaseSyncResult {
  success: boolean;
  uploaded: number;
  downloaded: number;
  error?: string;
  timestamp: number;
}

export interface UseSupabaseSyncReturn {
  syncToSupabase: (chats: unknown[]) => Promise<void>;
  syncFromSupabase: () => Promise<void>;
  isOffline: boolean;
}
