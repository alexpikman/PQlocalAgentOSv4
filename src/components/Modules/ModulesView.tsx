import React, { useState } from 'react';
import {
  Network,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  ArrowRight,
  Code,
  FileText,
  Boxes,
} from 'lucide-react';
import { GraphNode } from '../../types';

interface ModulesViewProps {
  initialNodes: GraphNode[];
}

export const ModulesView: React.FC<ModulesViewProps> = ({ initialNodes }) => {
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [runLogs, setRunLogs] = useState<string[]>([]);

  const handleRunPipeline = async () => {
    setIsRunning(true);
    setRunLogs(['Запуск графового пайплайна PQlocalAgentOSv3...']);

    // Reset status
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));

    for (let i = 0; i < nodes.length; i++) {
      setActiveStepIndex(i);
      setNodes((prev) =>
        prev.map((n, idx) => (idx === i ? { ...n, status: 'running' } : n))
      );

      const currentNode = nodes[i];
      setRunLogs((prev) => [
        ...prev,
        `[Шаг ${i + 1}/${nodes.length}] Выполняется узел «${currentNode.title}» (${currentNode.type})...`,
      ]);

      // Wait simulation for each step
      await new Promise((res) => setTimeout(res, 800));

      setNodes((prev) =>
        prev.map((n, idx) => (idx === i ? { ...n, status: 'success' } : n))
      );

      setRunLogs((prev) => [
        ...prev,
        `✓ Узел «${currentNode.title}» успешно завершён. Данные переданы дальше.`,
      ]);
    }

    setActiveStepIndex(null);
    setIsRunning(false);
    setRunLogs((prev) => [
      ...prev,
      '🎉 Пайплайн успешно завершён: результат передан в рабочее пространство чата.',
    ]);
  };

  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'input':
        return FileText;
      case 'template':
        return Code;
      case 'ollama':
        return Cpu;
      case 'transform':
        return Layers;
      case 'output':
        return CheckCircle2;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Графовый исполнитель и Модули</span>
            <span className="text-xs font-mono font-normal text-cyan-400">
              (Pipeline Engine)
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Конвейерная обработка задач: input → template → ollama → transform → output
          </p>
        </div>

        <button
          onClick={handleRunPipeline}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Выполнение пайплайна...' : 'Запустить пайплайн'}</span>
        </button>
      </div>

      {/* Visual Pipeline Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Цепочка графовых узлов</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">5 связанных операций</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {nodes.map((node, index) => {
            const Icon = getNodeIcon(node.type);
            const isCurrent = activeStepIndex === index;

            return (
              <div
                key={node.id}
                className={`bg-slate-950 border rounded-xl p-3.5 flex flex-col justify-between space-y-3 transition-all ${
                  isCurrent
                    ? 'border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400'
                    : node.status === 'success'
                    ? 'border-emerald-600/60 bg-emerald-950/10'
                    : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 font-mono">
                    <span>ШАГ #{index + 1}</span>
                    <span className="uppercase text-cyan-400">{node.type}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        node.status === 'success'
                          ? 'bg-emerald-950 text-emerald-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200 leading-snug">
                      {node.title}
                    </h4>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800/80 truncate">
                  {JSON.stringify(node.config)}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Статус:</span>
                  <span
                    className={`font-mono font-medium ${
                      node.status === 'success'
                        ? 'text-emerald-400'
                        : node.status === 'running'
                        ? 'text-cyan-400 animate-pulse'
                        : 'text-slate-500'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Terminal Console */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Журнал выполнения графового сценария</span>
          </span>
          <button
            onClick={() => setRunLogs([])}
            className="text-slate-500 hover:text-slate-300 text-[10px]"
          >
            Очистить лог
          </button>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1 text-slate-300 pt-1">
          {runLogs.map((log, i) => (
            <div
              key={i}
              className={`${
                log.includes('✓')
                  ? 'text-emerald-400'
                  : log.includes('🎉')
                  ? 'text-cyan-300 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
          {runLogs.length === 0 && (
            <div className="text-slate-600 italic">Нажмите «Запустить пайплайн» для тестирования сценария.</div>
          )}
        </div>
      </div>
    </div>
  );
};
