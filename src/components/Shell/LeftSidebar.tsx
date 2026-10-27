import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  GitBranch,
  FolderGit2,
  CheckSquare,
  Bot,
  Cpu,
  Terminal,
  Activity,
  Network,
  ShieldCheck,
  FileCheck2,
  ChevronLeft,
} from 'lucide-react';
import { ActiveNavTab } from '../../types';

interface LeftSidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  isOpen: boolean;
  onToggle: () => void;
  tasksCount: number;
  modelsCount: number;
  projectsCount: number;
}

interface NavItem {
  id: ActiveNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  highlight?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onToggle,
  tasksCount,
  modelsCount,
  projectsCount,
}) => {
  const navSections: NavSection[] = [
    {
      group: 'РАБОЧЕЕ ПРОСТРАНСТВО',
      items: [
        {
          id: 'dashboard' as ActiveNavTab,
          label: 'Рабочий стол',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'chat' as ActiveNavTab,
          label: 'Чат с агентами',
          icon: MessageSquare,
          badge: null,
        },
        {
          id: 'system_map' as ActiveNavTab,
          label: 'Карта системы',
          icon: GitBranch,
          badge: 'Матрица',
          highlight: true,
        },
      ],
    },
    {
      group: 'ПРОЦЕССЫ И СУЩНОСТИ',
      items: [
        {
          id: 'projects' as ActiveNavTab,
          label: 'Проекты и Память',
          icon: FolderGit2,
          badge: projectsCount.toString(),
        },
        {
          id: 'tasks' as ActiveNavTab,
          label: 'Задачи и Канбан',
          icon: CheckSquare,
          badge: tasksCount.toString(),
        },
      ],
    },
    {
      group: 'AI-РЕСУРСЫ И РОЛИ',
      items: [
        {
          id: 'agents' as ActiveNavTab,
          label: 'AI-Агенты (8 ролей)',
          icon: Bot,
          badge: '8',
        },
        {
          id: 'providers' as ActiveNavTab,
          label: 'Модели и Провайдеры',
          icon: Cpu,
          badge: `${modelsCount} мод.`,
        },
        {
          id: 'modules' as ActiveNavTab,
          label: 'Графовые модули',
          icon: Network,
          badge: null,
        },
      ],
    },
    {
      group: 'СИСТЕМА И БЕЗОПАСНОСТЬ',
      items: [
        {
          id: 'terminal' as ActiveNavTab,
          label: 'Терминал и Команды',
          icon: Terminal,
          badge: null,
        },
        {
          id: 'diagnostics' as ActiveNavTab,
          label: 'Телеметрия (16 ядер)',
          icon: Activity,
          badge: null,
        },
        {
          id: 'audit' as ActiveNavTab,
          label: 'Аудит ядра (audit_checks)',
          icon: ShieldCheck,
          badge: '11 тестов',
        },
        {
          id: 'report' as ActiveNavTab,
          label: 'Дорожная карта (P0—P4)',
          icon: FileCheck2,
          badge: 'Аудит',
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed lg:static top-14 bottom-0 left-0 z-20 flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-200 select-none ${
        isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16'
      }`}
    >
      {/* Workspace indicator */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className={`overflow-hidden transition-all ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
          <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold font-mono">
            PQlocalAgentOS v4
          </div>
          <div className="text-xs font-medium text-slate-200 truncate">
            Local AI Platform #1
          </div>
        </div>

        <button
          onClick={onToggle}
          className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition-colors hidden lg:block"
          title={isOpen ? 'Свернуть панель' : 'Развернуть панель'}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${!isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation list */}
      <div className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {isOpen && (
              <div className="px-3 text-[9px] font-mono tracking-wider text-slate-500 uppercase font-semibold">
                {section.group}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={!isOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? item.highlight
                        ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'bg-slate-800 text-slate-100 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-cyan-400'
                        : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />

                  {isOpen && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                            item.highlight
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500">
        {isOpen ? (
          <div className="space-y-1 text-[10px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Стек:</span>
              <span className="font-mono text-cyan-400">FastAPI + React 19</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Хранилище:</span>
              <span className="font-mono text-slate-300">data/*.json</span>
            </div>
          </div>
        ) : (
          <div className="text-center font-mono text-[10px] text-cyan-400 font-bold">v4</div>
        )}
      </div>
    </aside>
  );
};
