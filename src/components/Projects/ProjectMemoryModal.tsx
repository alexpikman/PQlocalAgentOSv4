import React, { useState } from 'react';
import {
  FileText,
  Save,
  Trash2,
  X,
  AlertTriangle,
  Plus,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectMemoryModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveMemory: (projectId: string, memory: Project['memory']) => void;
}

export const ProjectMemoryModal: React.FC<ProjectMemoryModalProps> = ({
  project,
  isOpen,
  onClose,
  onSaveMemory,
}) => {
  if (!isOpen || !project) return null;

  const [activeTab, setActiveTab] = useState<'summary' | 'constraints' | 'tasks' | 'agents'>('summary');
  const [summary, setSummary] = useState(project.memory.summary);
  const [constraints, setConstraints] = useState<string[]>([...project.memory.constraints]);
  const [tasksNotes, setTasksNotes] = useState(project.memory.tasksNotes);
  const [agentsNotes, setAgentsNotes] = useState(project.memory.agentsNotes);
  const [newConstraint, setNewConstraint] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSaveMemory(project.id, {
      summary,
      constraints,
      tasksNotes,
      agentsNotes,
      lastUpdated: 'Только что обновлено',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddConstraint = () => {
    if (!newConstraint.trim()) return;
    setConstraints([...constraints, newConstraint.trim()]);
    setNewConstraint('');
  };

  const handleRemoveConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const handleClearMemory = () => {
    setSummary('');
    setConstraints([]);
    setTasksNotes('');
    setAgentsNotes('');
    setShowClearConfirm(false);
    onSaveMemory(project.id, {
      summary: '',
      constraints: [],
      tasksNotes: '',
      agentsNotes: '',
      lastUpdated: 'Очищено',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full flex flex-col max-h-[85vh] shadow-2xl animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-mono">
                Память проекта · {project.environment.toUpperCase()}
              </div>
              <h2 className="text-base font-semibold text-slate-100">{project.title}</h2>
            </div>
          </div>

          {/* Action buttons on top right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-800/60 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium transition-colors"
              title="Очистить только память проекта (проект не будет удален)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Очистить память</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Сохранено!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Сохранить память</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="px-6 pt-2 border-b border-slate-800 flex items-center gap-2 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'summary'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Сводка проекта
          </button>
          <button
            onClick={() => setActiveTab('constraints')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'constraints'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Ограничения и правила ({constraints.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'tasks'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Заметки задач
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'agents'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Инструкции агентам
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'summary' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Сводный контекст и цели проекта
              </label>
              <p className="text-xs text-slate-400">
                Этот текст автоматически инжектируется в системный контекст агентов при работе с
                проектом.
              </p>
              <textarea
                rows={6}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
                placeholder="Опишите назначение проекта, используемый стек и глобальные ориентиры..."
              />
              <div className="text-[11px] text-slate-500 font-mono">
                Последнее обновление: {project.memory.lastUpdated}
              </div>
            </div>
          )}

          {activeTab === 'constraints' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block">
                  Строгие системные ограничения (Constraints)
                </label>
                <p className="text-xs text-slate-400">
                  Правила, которые агент обязан неукоснительно соблюдать при генерации кода или
                  выполнении команд.
                </p>
              </div>

              {/* Add constraint input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newConstraint}
                  onChange={(e) => setNewConstraint(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddConstraint()}
                  placeholder="Добавить новое правило, например: Не удалять файлы без бэкапа..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddConstraint}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить</span>
                </button>
              </div>

              {/* Constraints list */}
              <div className="space-y-2">
                {constraints.map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-3 p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-cyan-400 font-semibold">{index + 1}.</span>
                      <span className="text-slate-200 leading-relaxed">{rule}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveConstraint(index)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                      title="Удалить правило"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {constraints.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500 italic">
                    Список ограничений пуст. Добавьте правила безопасности.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Заметки по связанным задачам
              </label>
              <textarea
                rows={6}
                value={tasksNotes}
                onChange={(e) => setTasksNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                placeholder="Заметки по дедлайнам, статусам и блокирующим зависимостям..."
              />
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Специальные инструкции для назначенных агентов
              </label>
              <textarea
                rows={6}
                value={agentsNotes}
                onChange={(e) => setAgentsNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                placeholder="Инструкции по стилю кода, соглашениям о коммитах и валидации..."
              />
            </div>
          )}
        </div>

        {/* Clear memory confirmation dialog (Section 7) */}
        {showClearConfirm && (
          <div className="absolute inset-0 z-60 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-rose-800/80 rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <h4 className="font-semibold text-sm text-slate-100">
                  Подтверждение очистки памяти проекта
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Вы собираетесь очистить только <strong>память и ограничения</strong> данного проекта.
                Сам проект, его файлы, среда и связанные задачи <strong>не будут удалены</strong>.
              </p>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleClearMemory}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Да, очистить память
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
