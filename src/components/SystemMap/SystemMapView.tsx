import React, { useState } from 'react';
import {
  GitBranch,
  ShieldAlert,
  Network,
  Layers,
  Compass,
  Code2,
  Palette,
  FileText,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  Database,
  Brain,
  Lock,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Agent } from '../../types';

interface SystemMapViewProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
}

export const SystemMapView: React.FC<SystemMapViewProps> = ({ agents, onSelectAgent }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('manager');

  const selectedAgent = agents.find((a) => a.id === selectedNodeId) || agents[0];

  const specialistRoles = agents.filter(
    (a) => a.id !== 'manager' && a.id !== 'dispatcher'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>Архитектурный протокол: Иерархическая матрица управления</span>
            <span>·</span>
            <span className="text-cyan-400">PQlocalAgentOSv4</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <span>Карта системы и Потоки данных</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Интерактивная схема ролей, распределения полномочий, памяти проекта и маршрутизации артефактов
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Изоляция уровней доступа: Активна</span>
        </div>
      </div>

      {/* Main Grid: Visual Flow on Left, Node Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Column (2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Level 1: Manager (General) */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => setSelectedNodeId('manager')}
              className={`w-full max-w-md p-4 rounded-xl border cursor-pointer transition-all ${
                selectedNodeId === 'manager'
                  ? 'bg-blue-950/50 border-blue-500 shadow-lg shadow-blue-950/50 ring-1 ring-blue-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    Г1
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
                      Уровень 1 · Руководитель процесса
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100">Менеджер (Генерал)</h3>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">auth: 1</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Принимает стратегические решения и утверждает план. Не читает сырые файлы напрямую — общается исключительно через Диспетчера.
              </p>
            </div>

            {/* Connecting Arrow */}
            <div className="my-2 flex flex-col items-center text-slate-500 text-[10px] font-mono">
              <span className="text-blue-400">▼ Генеральный план (JSON)</span>
              <span className="text-cyan-400">▲ Сводный аналитический отчёт (JSON)</span>
            </div>

            {/* Level 2: Dispatcher (Premier) */}
            <div
              onClick={() => setSelectedNodeId('dispatcher')}
              className={`w-full max-w-md p-4 rounded-xl border cursor-pointer transition-all ${
                selectedNodeId === 'dispatcher'
                  ? 'bg-cyan-950/50 border-cyan-400 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    Д2
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                      Уровень 2 · Единый координатор
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100">Диспетчер (Премьер)</h3>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">auth: 2</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Единая точка маршрутизации задач, запросов, артефактов и памяти. Распределяет подзадачи между профильными агентами.
              </p>
            </div>

            {/* Connecting Arrow */}
            <div className="my-2 flex flex-col items-center text-slate-500 text-[10px] font-mono">
              <span className="text-cyan-400">▼ Декомпозированные задания специалистам</span>
              <span className="text-emerald-400">▲ Проверенные результаты и отчёты</span>
            </div>
          </div>

          {/* Level 3: Specialists Matrix */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                Уровень 3 · Профильные специалисты команды
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {specialistRoles.length} активных ролей
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {specialistRoles.map((agent) => {
                const isSelected = selectedNodeId === agent.id;

                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedNodeId(agent.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-500 bg-slate-900 shadow-md ring-1 ring-cyan-500'
                        : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm"
                          style={{ backgroundColor: agent.avatarColor }}
                        >
                          {agent.authority}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          auth: {agent.authority}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 truncate">{agent.name}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                        {agent.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-800/60 text-[9px] font-mono text-slate-500 flex justify-between">
                      <span>{agent.role}</span>
                      <span className="text-cyan-400">
                        {Object.values(agent.permissions).filter(Boolean).length} прав
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shared Memory & Precedents Store Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-start gap-3">
              <Brain className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Память проектов (data/memory)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Сводка, системные ограничения, правила и неразрывный контекст.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-start gap-3">
              <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Журнал прецедентов (decisions_log)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  База прошлых сбоев и предотвращение повторных ошибок при весе риска &gt; 5.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inspector Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Свойства узла системы
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">Уровень {selectedAgent.authority}</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md"
              style={{ backgroundColor: selectedAgent.avatarColor }}
            >
              {selectedAgent.authority}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100">{selectedAgent.name}</h4>
              <div className="text-xs font-mono text-cyan-400 font-medium">{selectedAgent.role}</div>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 block mb-1">Назначение и полномочия:</span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              {selectedAgent.description}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 block mb-1">Системная инструкция (Промпт):</span>
            <p className="text-[11px] text-slate-400 font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-36 overflow-y-auto">
              {selectedAgent.systemPrompt}
            </p>
          </div>

          {/* Permissions Matrix */}
          <div>
            <span className="text-[11px] text-slate-500 block mb-1.5 font-semibold">
              Матрица прав доступа к инструментам:
            </span>
            <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800 max-h-48 overflow-y-auto">
              {Object.entries(selectedAgent.permissions).map(([perm, val]) => (
                <div key={perm} className="flex items-center justify-between text-[11px] py-0.5">
                  <span className="text-slate-400 font-mono truncate">{perm}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                      val ? 'bg-emerald-950/60 text-emerald-400' : 'text-slate-600'
                    }`}
                  >
                    {val ? 'РАЗРЕШЕНО' : 'ЗАПРЕЩЕНО'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectAgent(selectedAgent)}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            Выбрать для активного диалога
          </button>
        </div>
      </div>
    </div>
  );
};
