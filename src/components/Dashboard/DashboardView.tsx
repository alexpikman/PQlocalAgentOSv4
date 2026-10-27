import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  HardDrive,
  Database,
  FolderGit2,
  CheckSquare,
  Bot,
  MessageSquare,
  ShieldCheck,
  GitBranch,
  ArrowRight,
  Terminal,
  Activity,
  Plus,
} from 'lucide-react';
import { Project, Task, Agent, Model, TelemetryData, ActiveNavTab } from '../../types';

interface DashboardViewProps {
  projects: Project[];
  tasks: Task[];
  agents: Agent[];
  models: Model[];
  telemetry: TelemetryData;
  onNavigate: (tab: ActiveNavTab) => void;
  onSelectProject: (p: Project) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  tasks,
  agents,
  models,
  telemetry,
  onNavigate,
  onSelectProject,
}) => {
  const queuedTasks = tasks.filter((t) => t.status === 'queued');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Eyebrow & Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-2">
            <span>CONTROL CENTER</span>
            <span>·</span>
            <span>PQ LOCALAGENT OS V4</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Рабочий стол платформы
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Единая среда управления локальными AI-моделями, проектами, агентами и безопасностью
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('chat')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Открыть Чат</span>
          </button>
          <button
            onClick={() => onNavigate('system_map')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>Карта системы</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('projects')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 cursor-pointer transition-all space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Проекты</span>
            <FolderGit2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-100">{projects.length}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>{projects.filter((p) => p.environment === 'local').length} local</span>
            <span>·</span>
            <span>{projects.filter((p) => p.environment === 'ssh').length} ssh</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('tasks')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 cursor-pointer transition-all space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Задачи в очереди</span>
            <CheckSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-100">{tasks.length}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-amber-400 font-mono">{inProgressTasks.length} в работе</span>
            <span>·</span>
            <span>{queuedTasks.length} очередь</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('agents')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 cursor-pointer transition-all space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI-Агенты</span>
            <Bot className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-100">{agents.length}</div>
          <div className="text-[11px] text-slate-500">8 системных ролей</div>
        </div>

        <div
          onClick={() => onNavigate('providers')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 cursor-pointer transition-all space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Модели и Серверы</span>
            <Cpu className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-100">{models.length}</div>
          <div className="text-[11px] text-slate-500">Ollama · LM Studio · GGUF</div>
        </div>
      </div>

      {/* Live Telemetry Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">Live Telemetry Monitor</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Частота обновления: TTL {telemetry.serverCacheTtlSec}с
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>CPU (16 Cores)</span>
              <span className="font-mono text-cyan-400 font-semibold">{telemetry.cpuUsage}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${telemetry.cpuUsage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>RAM</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {telemetry.ramUsedGb} / {telemetry.ramTotalGb} GB
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(telemetry.ramUsedGb / telemetry.ramTotalGb) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>GPU VRAM</span>
              <span className="font-mono text-amber-400 font-semibold">
                {telemetry.vramUsedGb} / {telemetry.vramTotalGb} GB
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(telemetry.vramUsedGb / telemetry.vramTotalGb) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Projects & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
              <span>Проекты платформы</span>
            </h3>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Все проекты</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProject(p);
                  onNavigate('projects');
                }}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg hover:border-slate-700 cursor-pointer transition-all flex items-start gap-3"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shrink-0 flex items-center justify-center">
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <FolderGit2 className="w-6 h-6 text-slate-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-200 truncate">{p.title}</h4>
                    <span className="text-[10px] font-mono uppercase text-cyan-400">{p.environment}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">{p.workingDir}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Очередь задач</span>
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Канбан-доска</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 4).map((t) => (
              <div
                key={t.id}
                onClick={() => onNavigate('tasks')}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mb-0.5">
                    <span>{t.createdAt}</span>
                    <span>·</span>
                    <span className="text-cyan-400 font-mono">{t.priority}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 truncate">{t.title}</h4>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                    t.status === 'done'
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                      : t.status === 'in_progress'
                      ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
