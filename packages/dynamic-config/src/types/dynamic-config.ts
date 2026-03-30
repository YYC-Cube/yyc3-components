export interface LLMProviderConfig {
  id: string;
  name: string;
  displayName: string;
  baseUrl: string;
  apiKeyEnvVar: string;
  apiKeyOverride?: string;
  isEnabled: boolean;
  priority: number;
  color: string;
  models: string[];
  description: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  displayName: string;
  providerId: string;
  description: string;
  color: string;
  isAvailable: boolean;
  capabilities: string[];
  maxTokens?: number;
  contextWindow?: number;
}

export interface AIAgentConfig {
  id: string;
  roleId: string;
  name: string;
  nameCN: string;
  version: string;
  role: string;
  roleCN: string;
  modelId: string;
  providerId: string;
  color: string;
  status: 'active' | 'standby' | 'inactive';
  capabilities: string[];
  permissions: { canDeploy: boolean; canReview: boolean };
}

export interface EndpointConfig {
  id: string;
  name: string;
  url: string;
  envVar: string;
  description: string;
  category: string;
  isHealthy: boolean;
  lastChecked?: unknown;
}

export interface MCPServerConfig {
  id: string;
  name: string;
  url: string;
  status: string;
  latency: string;
  description: string;
  isEnabled: boolean;
  capabilities: string[];
}

export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  steps: number;
  status: 'active' | 'inactive';
  trigger: 'auto' | 'manual' | 'schedule';
  createdAt: number;
}

export interface ExtensionConfig {
  id: string;
  name: string;
  description: string;
  isInstalled: boolean;
  isEnabled: boolean;
  version: string;
  author: string;
  category: string;
}

export interface ComputeNodeConfig {
  id: string;
  name: string;
  host: string;
  type: string;
  status: string;
  specs: Record<string, string>;
  metrics: Record<string, number>;
  isEnabled: boolean;
}

export type ConfigSection =
  | 'providers'
  | 'models'
  | 'agents'
  | 'endpoints'
  | 'mcpServers'
  | 'workflows'
  | 'extensions'
  | 'computeNodes';

export interface NetworkConfig {
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  connectionTimeout: number;
  agentCallTimeout: number;
  maxReconnectDelay: number;
  backoffMultiplier: number;
}

export interface UIConfig {
  avatarRailCollapsedWidth: number;
  avatarRailExpandedWidth: number;
  maxVisibleMessages: number;
  terminalMaxLines: number;
  animationDuration: number;
  typingSpeed: number;
  toastDuration: number;
}

export interface DynamicConfig {
  providers: LLMProviderConfig[];
  models: ModelConfig[];
  agents: AIAgentConfig[];
  endpoints: EndpointConfig[];
  mcpServers: MCPServerConfig[];
  workflows: WorkflowConfig[];
  extensions: ExtensionConfig[];
  computeNodes: ComputeNodeConfig[];
  networkConfig: NetworkConfig;
  uiConfig: UIConfig;
  version: number;
  lastModified: number;
  _schemaVersion?: number;
}

export interface ConfigSchema {
  version: number;
  sections: Record<string, unknown>;
}

export interface ConfigVersion {
  version: number;
  timestamp: number;
  author: string;
  description: string;
}

export interface ConfigChange {
  section: ConfigSection;
  action: 'add' | 'update' | 'delete';
  id: string;
  timestamp: number;
  previous?: unknown;
  current?: unknown;
}

export type UseDynamicConfigReturn =
  import('../hooks/useDynamicConfig').DynamicConfigContextType;
