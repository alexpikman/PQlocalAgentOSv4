import React from 'react';
import {
  FolderGit2,
  Cpu,
  Layers,
  Terminal,
  Clock,
  ExternalLink,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Project, Agent, TelemetryData } from '../../types';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: Project | null;
  onSelectProject: (p: Project) => void;
  allProjects: Project[];
  activeAgent: Agent | null;
  telemetry: TelemetryData;
  onOpenMemory: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  activeProject,
  onSelectProject,
  allProjects,
  activeAgent,
  telemetry,
  onOpenMemory,
}) => {
  if (!isOpen) return null;

  return (
    <aside className="w-80 shrink-0 border-l border-slate-800 bg-slate-950 p-4 overflow-y-auto space-y-5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Контекст и Монитор
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition-colors"
          title="Скрыть панель"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Project Card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">Активный проект</span>
          <select
            value={activeProject?.id || ''}
            onChange={(e) => {
              const found = allProjects.find((p) => p.id === e.target.value);
              if (found) onSelectProject(found);
            }}
            className="text-[11px] bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {allProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {activeProject ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-3">
            <div className="flex items-start gap-2.5">
              {activeProject.logoUrl ? (
                <img
                  src={activeProject.logoUrl}
                  alt={activeProject.title}
                  className="w-10 h-10 rounded-md object-cover border border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <FolderGit2 className="w-5 h-5" />
                </div>
              )}
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {activeProject.title}
                </div>
                {/* Clean unboxed metadata separator */}
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-cyan-400 uppercase">{activeProject.environment}</span>
                  <span>·</span>
                  <span>{activeProject.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 line-clamp-2">
              {activeProject.description}
            </div>

            <div className="bg-slate-950/60 p-2 rounded text-[11px] font-mono text-slate-400 truncate border border-slate-800/60">
              <span className="text-slate-500">dir: </span>
              {activeProject.workingDir}
            </div>

            {/* Sandbox Security Advisory (from Section 8) */}
            <div className="flex items-start gap-1.5 p-2 bg-amber-950/30 border border-amber-800/40 rounded text-[10px] text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>Примечание безопасности:</strong> working_dir задает начальный каталог команды, но не является аппаратной песочницей.
              </span>
            </div>

            <button
              onClick={onOpenMemory}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-md transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Открыть память проекта</span>
              <span className="text-[10px] text-slate-400">
                ({activeProject.memory.constraints.length} правил)
              </span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic p-3 text-center border border-dashed border-slate-800 rounded-lg">
            Проект не выбран
          </div>
        )}
      </div>

      {/* Active Agent Info */}
      <div className="space-y-2">
        <span className="text-[11px] font-medium text-slate-400">Назначенный агент</span>
        {activeAgent ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: activeAgent.avatarColor }}
              >
                {activeAgent.name.slice(0, 2)}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">{activeAgent.name}</div>
                <div className="text-[10px] text-slate-400">{activeAgent.role}</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-2">
              {activeAgent.systemPrompt}
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {activeAgent.permittedTools.map((tool) => (
                <span
                  key={tool}
                  className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic">Агент не выбран</div>
        )}
      </div>

      {/* Mini Telemetry Ticker (Section 10) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">Мини-телеметрия</span>
          <span className="text-[10px] font-mono text-cyan-400">
            кеш {telemetry.serverCacheTtlSec}с
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-2.5 text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Загрузка CPU (16 ядер)</span>
              <span className="font-mono text-slate-200">{telemetry.cpuUsage}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${telemetry.cpuUsage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">RAM (ОЗУ)</span>
              <span className="font-mono text-slate-200">
                {telemetry.ramUsedGb} / {telemetry.ramTotalGb} GB
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(telemetry.ramUsedGb / telemetry.ramTotalGb) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">GPU VRAM</span>
              <span className="font-mono text-slate-200">
                {telemetry.vramUsedGb} / {telemetry.vramTotalGb} GB
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(telemetry.vramUsedGb / telemetry.vramTotalGb) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Uptime {telemetry.uptimeHours}ч
            </span>
            <span>{telemetry.lastCacheRefreshed}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
