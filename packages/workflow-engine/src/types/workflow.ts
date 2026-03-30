export type { WorkflowStep, WorkflowStatus, StepStatus, WorkflowDefinition, WorkflowInstance } from '../services/workflow-engine';

export type Workflow = WorkflowDefinition;

export interface WorkflowExecution {
  instanceId: string;
  workflowId: string;
  status: import('../services/workflow-engine').WorkflowStatus;
  startedAt: number;
  completedAt?: number;
  steps: import('../services/workflow-engine').WorkflowStep[];
  output: Record<string, unknown>;
  error?: string;
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  defaultValue?: unknown;
  description?: string;
  required?: boolean;
}

export type WorkflowEvent =
  | { type: 'started'; instanceId: string; workflowId: string }
  | { type: 'step_started'; instanceId: string; stepId: string }
  | { type: 'step_completed'; instanceId: string; stepId: string; result: unknown }
  | { type: 'step_failed'; instanceId: string; stepId: string; error: string }
  | { type: 'completed'; instanceId: string; workflowId: string; duration: number }
  | { type: 'failed'; instanceId: string; workflowId: string; error: string }
  | { type: 'approval_required'; instanceId: string; stepId: string }
  | { type: 'approved'; instanceId: string; stepId: string }
  | { type: 'rejected'; instanceId: string; stepId: string; reason: string };

export interface AgentRoute {
  agentId: string;
  capabilities: string[];
  priority: number;
  maxConcurrent: number;
}

export interface Intent {
  id: string;
  name: string;
  description: string;
  workflowId: string;
  parameters: Record<string, unknown>;
  confidence: number;
}

export interface ParsedIntent {
  intent: Intent;
  extractedParams: Record<string, unknown>;
  confidence: number;
  alternatives: Intent[];
}
