import React, { useState, useEffect } from 'react';
import { Header } from './components/Shell/Header';
import { LeftSidebar } from './components/Shell/LeftSidebar';
import { RightSidebar } from './components/Shell/RightSidebar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { SystemMapView } from './components/SystemMap/SystemMapView';
import { ProjectsView } from './components/Projects/ProjectsView';
import { ProjectMemoryModal } from './components/Projects/ProjectMemoryModal';
import { TasksView } from './components/Tasks/TasksView';
import { AgentsView } from './components/Agents/AgentsView';
import { ProvidersView } from './components/Providers/ProvidersView';
import { ChatView } from './components/Chat/ChatView';
import { TerminalView } from './components/Terminal/TerminalView';
import { DiagnosticsView } from './components/Diagnostics/DiagnosticsView';
import { EnvironmentsView } from './components/Environments/EnvironmentsView';
import { ModulesView } from './components/Modules/ModulesView';
import { AuditView } from './components/Audit/AuditView';
import { ReportView } from './components/Report/ReportView';

import { useTheme } from './context/ThemeContext';

import {
  ActiveNavTab,
  Project,
  Task,
  Agent,
  Provider,
  Model,
  SSHConnection,
  GitHubConnection,
  TelemetryData,
  ChatMessage,
  TaskStatus,
} from './types';

import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_AGENTS,
  INITIAL_PROVIDERS,
  INITIAL_MODELS,
  INITIAL_SSH_CONNECTIONS,
  INITIAL_GITHUB_CONNECTION,
  INITIAL_TELEMETRY,
  INITIAL_MESSAGES,
  INITIAL_GRAPH_NODES,
  DEFAULT_PERMISSIONS,
} from './data/initialData';

export default function App() {
  const { themeMode, resolvedTheme, setThemeMode, toggleTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // Navigation & Shell Layout state
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [serverOnline, setServerOnline] = useState(true);
  const [shellPaddingX, setShellPaddingX] = useState(22);
  const [shellPaddingY, setShellPaddingY] = useState(24);

  // Domain Entities state
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project | null>(INITIAL_PROJECTS[0]);
  const [memoryModalProject, setMemoryModalProject] = useState<Project | null>(null);

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(INITIAL_AGENTS[0]);

  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [models, setModels] = useState<Model[]>(INITIAL_MODELS);
  const [sshConnections, setSshConnections] = useState<SSHConnection[]>(INITIAL_SSH_CONNECTIONS);
  const [githubConnection, setGithubConnection] = useState<GitHubConnection>(INITIAL_GITHUB_CONNECTION);

  const [telemetry, setTelemetry] = useState<TelemetryData>(INITIAL_TELEMETRY);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isGenerating, setIsGenerating] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Connect to live Python API on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const statsRes = await fetch('/api/system/stats');
        if (statsRes.ok) {
          const stats = await statsRes.json();
          if (stats.cpu && stats.cpu.logicalCores) {
            setTelemetry((prev) => ({
              ...prev,
              cpuUsage: stats.cpu.percent || prev.cpuUsage,
            }));
          }
        }
      } catch {}
    };

    fetchInitialData();
  }, []);

  // Mini telemetry auto-fluctuation simulation (illustrates cache TTL 5s from Section 10)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!serverOnline) return;
      setTelemetry((prev) => {
        const jitter = Math.floor(Math.random() * 7) - 3;
        const newCpu = Math.max(12, Math.min(85, prev.cpuUsage + jitter));
        return {
          ...prev,
          cpuUsage: newCpu,
          cores: prev.cores.map((c) => ({
            ...c,
            usagePercent: Math.max(8, Math.min(94, c.usagePercent + Math.floor(Math.random() * 9) - 4)),
          })),
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [serverOnline]);

  // Project handlers
  const handleSaveProject = (projectData: Partial<Project> & { id?: string }) => {
    if (projectData.id) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectData.id ? ({ ...p, ...projectData } as Project) : p))
      );
      if (activeProject?.id === projectData.id) {
        setActiveProject((prev) => (prev ? ({ ...prev, ...projectData } as Project) : null));
      }
      showToast('Проект успешно обновлён.');
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: projectData.title || 'Новый проект',
        description: projectData.description || '',
        createdAt: 'Сегодня',
        environment: projectData.environment || 'local',
        workingDir: projectData.workingDir || './',
        sshConnectionId: projectData.sshConnectionId,
        githubRepoUrl: projectData.githubRepoUrl,
        logoUrl: projectData.logoUrl,
        isInChat: true,
        memory: projectData.memory || {
          summary: 'Новый рабочий контекст проекта.',
          constraints: [],
          tasksNotes: '',
          agentsNotes: '',
          lastUpdated: 'Только что',
        },
      };
      setProjects((prev) => [newProj, ...prev]);
      setActiveProject(newProj);
      showToast('Новый проект создан и добавлен в рабочее пространство.');
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (activeProject?.id === projectId) {
      const remaining = projects.filter((p) => p.id !== projectId);
      setActiveProject(remaining[0] || null);
    }
    showToast('Проект удалён.');
  };

  const handleToggleChatProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isInChat: !p.isInChat } : p))
    );
  };

  const handleUnlinkProjectFromChat = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isInChat: false } : p))
    );
    showToast('Проект убран из локального чата (сохранён глобально в data/).');
  };

  const handleSaveMemory = (projectId: string, memory: Project['memory']) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, memory } : p))
    );
    if (activeProject?.id === projectId) {
      setActiveProject((prev) => (prev ? { ...prev, memory } : null));
    }
    showToast('Память проекта сохранена.');
  };

  // Task handlers
  const handleSaveTask = (taskData: Partial<Task> & { id?: string }) => {
    if (taskData.id) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? ({ ...t, ...taskData } as Task) : t))
      );
      showToast('Задача обновлена.');
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title || 'Новая задача',
        description: taskData.description || '',
        projectId: taskData.projectId || projects[0]?.id || '',
        assignedAgentId: taskData.assignedAgentId || agents[0]?.id || '',
        status: taskData.status || 'queued',
        priority: taskData.priority || 'medium',
        createdAt: 'Сегодня',
        dueDate: taskData.dueDate,
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('Задача создана.');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Задача удалена.');
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  // Agent handlers
  const handleSaveAgent = (agentData: Partial<Agent> & { id?: string }) => {
    if (agentData.id) {
      setAgents((prev) =>
        prev.map((a) => (a.id === agentData.id ? ({ ...a, ...agentData } as Agent) : a))
      );
      if (activeAgent?.id === agentData.id) {
        setActiveAgent((prev) => (prev ? ({ ...prev, ...agentData } as Agent) : null));
      }
      showToast('Агент обновлён.');
    } else {
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: agentData.name || 'Новый агент',
        role: agentData.role || 'SPECIALIST',
        authority: agentData.authority || 5,
        description: agentData.description || '',
        avatarColor: agentData.avatarColor || '#0ea5e9',
        avatarIcon: agentData.avatarIcon || 'Bot',
        modelId: agentData.modelId || models[0]?.id || '',
        systemPrompt: agentData.systemPrompt || '',
        temperature: agentData.temperature ?? 0.2,
        permissions: agentData.permissions || { ...DEFAULT_PERMISSIONS },
        permittedTools: agentData.permittedTools || ['Terminal', 'File System'],
        createdAt: 'Сегодня',
      };
      setAgents((prev) => [...prev, newAgent]);
      showToast('Новый агент создан.');
    }
  };

  const handleDeleteAgent = (agentId: string) => {
    if (agents.length <= 1) {
      showToast('Нельзя удалить единственного агента.');
      return;
    }
    setAgents((prev) => prev.filter((a) => a.id !== agentId));
    if (activeAgent?.id === agentId) {
      setActiveAgent(agents.filter((a) => a.id !== agentId)[0]);
    }
    showToast('Агент удалён.');
  };

  // Provider handlers
  const handleRefreshProvider = (provId: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === provId
          ? {
              ...p,
              status: 'online',
              latencyMs: Math.floor(Math.random() * 15) + 8,
            }
          : p
      )
    );
    showToast('Статус провайдера обновлён: онлайн.');
  };

  // SSH handlers
  const handleAddSshConnection = (conn: Omit<SSHConnection, 'id'>) => {
    const newConn: SSHConnection = {
      ...conn,
      id: `ssh-${Date.now()}`,
    };
    setSshConnections((prev) => [...prev, newConn]);
    showToast('SSH-хост добавлен.');
  };

  const handleTestSsh = async (id: string) => {
    await new Promise((res) => setTimeout(res, 800));
    setSshConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'connected', lastChecked: 'Только что' } : c))
    );
    return true;
  };

  // Chat message send handler
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    setTimeout(() => {
      const workingDir = activeProject?.workingDir || './';

      let agentResponseText = '';
      let toolCalls: ChatMessage['toolCalls'] = [];

      if (text.toLowerCase().includes('статус') || text.toLowerCase().includes('проект')) {
        agentResponseText = `Контекст проекта «${activeProject?.title}» активен.\nСреда: ${activeProject?.environment.toUpperCase()}.\nРабочий каталог: \`${workingDir}\`.\n\nВ памяти проекта зафиксировано ${activeProject?.memory.constraints.length} правил(а). Связанных задач в очереди: ${tasks.filter((t) => t.projectId === activeProject?.id).length}.`;
        toolCalls = [
          {
            tool: 'project_context_inspector',
            input: `inspect_project(id='${activeProject?.id}', env='${activeProject?.environment}')`,
            output: `Loaded ${activeProject?.memory.constraints.length} constraints, working_dir='${workingDir}'`,
            status: 'success',
          },
        ];
      } else if (text.toLowerCase().includes('ssh') || text.toLowerCase().includes('команд')) {
        agentResponseText = `Подготовка выполнения команды через Paramiko.\nКоманда предварена переходом в настроенный каталог:\n\`cd "${workingDir}" && ls -la\`\n\nSSRF-фильтр проверил сетевые дескрипторы — внутренние диапазоны заблокированы.`;
        toolCalls = [
          {
            tool: 'paramiko_ssh_exec',
            input: `cd "${workingDir}" && ls -la`,
            output: 'total 64\ndrwxr-xr-x 8 deploy deploy 4096 Oct 27 18:00 .\n-rw-r--r-- 1 deploy deploy 1205 Oct 27 18:00 pyproject.toml',
            status: 'success',
          },
        ];
      } else {
        agentResponseText = `Запрос обработан Генералом [${activeAgent?.name}].\n\nВ соответствии с архитектурным контрактом PQlocalAgentOSv4, задача декомпозирована через Диспетчера. Связи данных защищены (HTTP 409 при наличии задач). Готов запустить генерацию тестов или обновить память проекта.`;
      }

      const agentReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'agent',
        agentId: activeAgent?.id,
        content: agentResponseText,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCalls,
      };

      setMessages((prev) => [...prev, agentReply]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleClearChatHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'system',
        content: 'История сообщений очищена. Контекст проекта и настройки агентов сохранены.',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    showToast('История диалога очищена.');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        isDarkMode ? 'bg-[#0c0f17] text-slate-100' : 'bg-[#f1f5f9] text-slate-900'
      }`}
    >
      {/* Shell Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        leftSidebarOpen={leftSidebarOpen}
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        rightSidebarOpen={rightSidebarOpen}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        serverOnline={serverOnline}
        onToggleServerOnline={() => {
          setServerOnline(!serverOnline);
          showToast(!serverOnline ? 'Локальный сервер возобновлен (Online).' : 'Режим симуляции сбоя сервера (Offline).');
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleTheme}
        themeMode={themeMode}
        onSelectThemeMode={setThemeMode}
        shellPaddingX={shellPaddingX}
        shellPaddingY={shellPaddingY}
        onUpdatePadding={(x, y) => {
          setShellPaddingX(x);
          setShellPaddingY(y);
        }}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <LeftSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpen={leftSidebarOpen}
          onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
          tasksCount={tasks.length}
          modelsCount={models.length}
          projectsCount={projects.length}
        />

        {/* Dynamic Center Work Area with canonical padding */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            paddingLeft: `${shellPaddingX}px`,
            paddingRight: `${shellPaddingX}px`,
            paddingTop: `${shellPaddingY}px`,
            paddingBottom: `${shellPaddingY}px`,
          }}
        >
          {activeTab === 'dashboard' && (
            <DashboardView
              projects={projects}
              tasks={tasks}
              agents={agents}
              models={models}
              telemetry={telemetry}
              onNavigate={setActiveTab}
              onSelectProject={setActiveProject}
            />
          )}

          {activeTab === 'chat' && (
            <ChatView
              messages={messages}
              activeProject={activeProject}
              activeAgent={activeAgent}
              activeModel={models.find((m) => m.id === activeAgent?.modelId) || models[0]}
              onSendMessage={handleSendMessage}
              onClearHistory={handleClearChatHistory}
              onUnlinkProjectFromChat={handleUnlinkProjectFromChat}
              allAgents={agents}
              allModels={models}
              allProjects={projects}
              onSelectAgent={setActiveAgent}
              onSelectProject={setActiveProject}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === 'system_map' && (
            <SystemMapView
              agents={agents}
              onSelectAgent={(agent) => {
                setActiveAgent(agent);
                setActiveTab('chat');
                showToast(`Агент ${agent.name} выбран для диалога в чате.`);
              }}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              sshConnections={sshConnections}
              activeProject={activeProject}
              onSelectProject={setActiveProject}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
              onToggleChatProject={handleToggleChatProject}
              onOpenMemory={(p) => setMemoryModalProject(p)}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              projects={projects}
              agents={agents}
              onSaveTask={handleSaveTask}
              onDeleteTask={handleDeleteTask}
              onUpdateStatus={handleUpdateTaskStatus}
            />
          )}

          {activeTab === 'agents' && (
            <AgentsView
              agents={agents}
              models={models}
              activeAgent={activeAgent}
              onSelectAgent={setActiveAgent}
              onSaveAgent={handleSaveAgent}
              onDeleteAgent={handleDeleteAgent}
            />
          )}

          {activeTab === 'providers' && (
            <ProvidersView
              providers={providers}
              models={models}
              onRefreshProvider={handleRefreshProvider}
            />
          )}

          {activeTab === 'terminal' && (
            <TerminalView
              activeProject={activeProject}
              sshConnections={sshConnections}
            />
          )}

          {activeTab === 'diagnostics' && (
            <DiagnosticsView
              telemetry={telemetry}
              onRefreshTelemetry={() => {
                setTelemetry((prev) => ({
                  ...prev,
                  lastCacheRefreshed: 'Обновлено вручную (TTL 5с)',
                }));
                showToast('Телеметрия обновлена через psutil.');
              }}
            />
          )}

          {activeTab === 'environments' && (
            <EnvironmentsView
              sshConnections={sshConnections}
              githubConnection={githubConnection}
              onAddSshConnection={handleAddSshConnection}
              onTestSsh={handleTestSsh}
            />
          )}

          {activeTab === 'modules' && (
            <ModulesView initialNodes={INITIAL_GRAPH_NODES} />
          )}

          {activeTab === 'audit' && <AuditView />}

          {activeTab === 'report' && <ReportView />}
        </main>

        {/* Right Context & Quick Monitor Sidebar */}
        <RightSidebar
          isOpen={rightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
          activeProject={activeProject}
          onSelectProject={setActiveProject}
          allProjects={projects}
          activeAgent={activeAgent}
          telemetry={telemetry}
          onOpenMemory={() => {
            if (activeProject) setMemoryModalProject(activeProject);
          }}
        />
      </div>

      {/* Project Memory Drawer / Modal */}
      {memoryModalProject && (
        <ProjectMemoryModal
          project={memoryModalProject}
          isOpen={!!memoryModalProject}
          onClose={() => setMemoryModalProject(null)}
          onSaveMemory={handleSaveMemory}
        />
      )}

      {/* Floating System Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-slate-100 text-xs px-4 py-2.5 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
