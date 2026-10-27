export type EnvironmentType = 'local' | 'github' | 'ssh';

export type TaskStatus = 'queued' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface ProjectMemory {
  summary: string;
  constraints: string[];
  tasksNotes: string;
  agentsNotes: string;
  lastUpdated: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  environment: EnvironmentType;
  workingDir: string;
  sshConnectionId?: string;
  githubRepoUrl?: string;
  logoUrl?: string;
  memory: ProjectMemory;
  isInChat: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedAgentId: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  dueDate?: string;
}

export interface AgentPermissions {
  terminal_access: boolean;
  web_access: boolean;
  directory_creation: boolean;
  directory_deletion: boolean;
  directory_moving: boolean;
  file_loading: boolean;
  file_saving: boolean;
  file_deletion: boolean;
  file_moving: boolean;
  ssh_access: boolean;
  github_access: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  authority: number;
  description: string;
  avatarColor: string;
  avatarIcon: string;
  modelId: string;
  systemPrompt: string;
  temperature: number;
  permissions: AgentPermissions;
  permittedTools: string[];
  createdAt: string;
}

export type ProviderType = 'ollama' | 'lmstudio' | 'openai_compatible' | 'cloud';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  baseUrl: string;
  apiKeySet: boolean;
  status: 'online' | 'offline' | 'checking';
  modelsCount: number;
  latencyMs: number;
}

export interface Model {
  id: string;
  name: string;
  providerId: string;
  parametersCount: string;
  contextLength: string;
  isGguf: boolean;
  filePath?: string;
  ggufStatus?: 'ready' | 'dll_error' | 'not_verified';
}

export interface SSHConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  authType: 'key' | 'password';
  defaultWorkingDir: string;
  ssrfProtection: boolean;
  status: 'connected' | 'idle' | 'error';
  lastChecked?: string;
}

export interface GitHubConnection {
  id: string;
  name: string;
  tokenConfigured: boolean;
  dpapiEncrypted: boolean;
  repoUrl: string;
  workingDir: string;
  lastCheckStatus: 'verified' | 'failed' | 'pending';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  agentId?: string;
  content: string;
  createdAt: string;
  toolCalls?: {
    tool: string;
    input: string;
    output: string;
    status: 'success' | 'running' | 'error';
  }[];
}

export interface TelemetryCore {
  id: number;
  usagePercent: number;
  frequencyGhz: number;
}

export interface TelemetryData {
  cpuUsage: number;
  cores: TelemetryCore[];
  ramUsedGb: number;
  ramTotalGb: number;
  vramUsedGb: number;
  vramTotalGb: number;
  serverCacheTtlSec: number;
  lastCacheRefreshed: string;
  uptimeHours: number;
}

export interface GraphNode {
  id: string;
  type: 'input' | 'template' | 'ollama' | 'transform' | 'output';
  title: string;
  config: Record<string, any>;
  status: 'idle' | 'running' | 'success' | 'error';
}

export interface AuditCheckItem {
  id: string;
  category: string;
  severity: 'error' | 'info' | 'warning';
  status: 'pass' | 'fail' | 'skip';
  message: string;
  details?: any;
}

export interface AuditReportData {
  version: number;
  generated_at: string;
  duration_ms: number;
  summary: {
    total: number;
    pass: number;
    fail: number;
    skip: number;
    errors: number;
    warnings: number;
  };
  checks: AuditCheckItem[];
}

export type ThemeMode = 'dark' | 'light' | 'system';

export type ActiveNavTab =
  | 'dashboard'
  | 'chat'
  | 'system_map'
  | 'projects'
  | 'tasks'
  | 'agents'
  | 'providers'
  | 'terminal'
  | 'diagnostics'
  | 'environments'
  | 'permissions'
  | 'modules'
  | 'audit'
  | 'report';

