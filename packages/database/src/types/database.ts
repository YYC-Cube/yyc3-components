export type DatabaseType = 'mysql' | 'postgresql' | 'sqlite' | 'mongodb';

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export interface DatabaseConnection {
  id: string;
  name: string;
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  ssl?: boolean;
  poolSize?: number;
  timeout?: number;
  isDefault?: boolean;
  status: ConnectionStatus;
  createdAt: string;
  lastConnectedAt: string | null;
}

export interface ConnectionTestResult {
  success: boolean;
  latency: number;
  error: string | null;
  version: string | null;
}

export interface SQLQueryInput {
  connectionId: string;
  sql: string;
  params?: Record<string, unknown>;
}

export interface SQLQueryResult {
  success: boolean;
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTime: number;
  error: string | null;
  affectedRows?: number;
  warnings?: string[];
}

export interface SQLHistory {
  id: string;
  connectionId: string;
  sql: string;
  executedAt: string;
  executionTime: number;
  rowCount: number;
  success: boolean;
  affectedRows?: number;
  warnings?: string[];
}

export interface DatabaseTable {
  name: string;
  schema: string;
  columns: DatabaseColumn[];
  rowCount: number;
  size: number;
}

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: unknown;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

export interface ERDiagramData {
  tables: DatabaseTable[];
  relationships: Relationship[];
}

export interface Relationship {
  from: { table: string; column: string };
  to: { table: string; column: string };
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface BackupConfig {
  connectionId: string;
  outputPath: string;
  format: 'sql' | 'json';
  tables?: string[];
}

export interface BackupResult {
  success: boolean;
  filePath: string;
  size: number;
  duration: number;
  error: string | null;
  path?: string;
  createdAt?: string;
}

export interface RestoreConfig {
  connectionId: string;
  filePath: string;
}

export interface RestoreResult {
  success: boolean;
  duration: number;
  error: string | null;
}

export interface DatabaseStatistics {
  totalConnections: number;
  activeConnections: number;
  totalQueries: number;
  totalTables: number;
  totalSize: number;
}

export interface DatabaseConfig {
  defaultType: DatabaseType;
  maxConnections: number;
  queryTimeout: number;
  idleTimeout: number;
}

export interface QueryResult {
  success: boolean;
  data: Record<string, unknown>[];
  error: string | null;
}

export interface Transaction {
  id: string;
  connectionId: string;
  status: 'active' | 'committed' | 'rolledback';
  startTime: string;
}

export interface UseDatabaseReturn {
  connections: DatabaseConnection[];
  activeConnection: DatabaseConnection | null;
  loading: boolean;
  error: string | null;
  loadConnections: () => Promise<void>;
  createConnection: (
    conn: Omit<
      DatabaseConnection,
      'id' | 'createdAt' | 'lastConnectedAt' | 'status'
    >
  ) => Promise<void>;
  testConnection: (id: string) => Promise<void>;
  executeQuery: (input: SQLQueryInput) => Promise<SQLQueryResult>;
  getTables: (connectionId: string) => Promise<DatabaseTable[]>;
}

export interface UseDatabaseConfigReturn {
  config: DatabaseConfig;
  connectionStatus: ConnectionStatus;
  isConnecting: boolean;
  saveConfig: (newConfig: Partial<DatabaseConfig>) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  testConnection: () => Promise<boolean>;
}

export const DEFAULT_PORTS: Record<DatabaseType, number> = {
  mysql: 3306,
  postgresql: 5432,
  sqlite: 0,
  mongodb: 27017,
};

export const DANGEROUS_SQL_KEYWORDS = [
  'DROP DATABASE',
  'DROP TABLE',
  'TRUNCATE',
  'DELETE FROM',
  'ALTER TABLE',
  'GRANT',
  'REVOKE',
  'CREATE USER',
];
