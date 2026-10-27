import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Edit2,
  Trash2,
  Cpu,
  Wrench,
  Sliders,
  Terminal,
  Shield,
  Layers,
  Code2,
  Compass,
  Check,
} from 'lucide-react';
import { Agent, Model } from '../../types';

interface AgentsViewProps {
  agents: Agent[];
  models: Model[];
  activeAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
  onSaveAgent: (agent: Partial<Agent> & { id?: string }) => void;
  onDeleteAgent: (agentId: string) => void;
}

const AVAILABLE_ICONS = ['Layers', 'Code2', 'Terminal', 'Compass', 'Bot', 'Cpu'];
const COLOR_PALETTE = [
  '#0ea5e9', // Sky Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#6366f1', // Indigo
];

const AVAILABLE_TOOLS = [
  'File System',
  'Terminal',
  'SSH',
  'Paramiko Runner',
  'Git',
  'Web Search',
  'API Validator',
];

export const AgentsView: React.FC<AgentsViewProps> = ({
  agents,
  models,
  activeAgent,
  onSelectAgent,
  onSaveAgent,
  onDeleteAgent,
}) => {
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state (Avatar Studio & Domain Modal)
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAvatarColor, setFormAvatarColor] = useState(COLOR_PALETTE[0]);
  const [formAvatarIcon, setFormAvatarIcon] = useState('Bot');
  const [formModelId, setFormModelId] = useState('');
  const [formPrompt, setFormPrompt] = useState('');
  const [formTemperature, setFormTemperature] = useState(0.2);
  const [formTools, setFormTools] = useState<string[]>([]);

  const handleStartCreate = () => {
    setFormName('');
    setFormRole('');
    setFormDesc('');
    setFormAvatarColor(COLOR_PALETTE[0]);
    setFormAvatarIcon('Bot');
    setFormModelId(models[0]?.id || '');
    setFormPrompt('Ты специализированный ИИ-агент системы PQlocalAgentOSv3...');
    setFormTemperature(0.2);
    setFormTools(['File System', 'Terminal']);
    setEditingAgent(null);
    setIsModalOpen(true);
  };

  const handleStartEdit = (a: Agent) => {
    setFormName(a.name);
    setFormRole(a.role);
    setFormDesc(a.description);
    setFormAvatarColor(a.avatarColor);
    setFormAvatarIcon(a.avatarIcon);
    setFormModelId(a.modelId);
    setFormPrompt(a.systemPrompt);
    setFormTemperature(a.temperature);
    setFormTools([...a.permittedTools]);
    setEditingAgent(a);
    setIsModalOpen(true);
  };

  const handleToggleTool = (tool: string) => {
    if (formTools.includes(tool)) {
      setFormTools(formTools.filter((t) => t !== tool));
    } else {
      setFormTools([...formTools, tool]);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingAgent) {
      onSaveAgent({
        id: editingAgent.id,
        name: formName.trim(),
        role: formRole.trim(),
        description: formDesc.trim(),
        avatarColor: formAvatarColor,
        avatarIcon: formAvatarIcon,
        modelId: formModelId,
        systemPrompt: formPrompt.trim(),
        temperature: formTemperature,
        permittedTools: formTools,
      });
    } else {
      onSaveAgent({
        name: formName.trim(),
        role: formRole.trim(),
        description: formDesc.trim(),
        avatarColor: formAvatarColor,
        avatarIcon: formAvatarIcon,
        modelId: formModelId,
        systemPrompt: formPrompt.trim(),
        temperature: formTemperature,
        permittedTools: formTools,
        createdAt: 'Сегодня',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Агенты и Аватар-студия</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              ({agents.length})
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Конфигурация автономных ролей, системных промптов, аватаров и прав доступа к инструментам
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Создать агента</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const isSelected = activeAgent?.id === agent.id;
          const assignedModel = models.find((m) => m.id === agent.modelId);

          return (
            <div
              key={agent.id}
              className={`bg-slate-900 border rounded-xl p-5 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-500/70 shadow-lg shadow-cyan-950/20 bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Date above title (Section 4) */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span>Создан: {agent.createdAt}</span>
                  <span className="font-mono text-cyan-400">t = {agent.temperature}</span>
                </div>

                {/* Avatar and Name */}
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-inner shrink-0"
                    style={{ backgroundColor: agent.avatarColor }}
                  >
                    {agent.name.slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => onSelectAgent(agent)}
                        className="text-sm font-semibold text-slate-100 hover:text-cyan-400 cursor-pointer truncate transition-colors"
                      >
                        {agent.name}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] text-cyan-400 font-mono">(выбран)</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{agent.role}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {agent.description}
                </p>

                {/* Assigned Model */}
                <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-400">Модель:</span>
                    <span className="text-slate-200 font-medium">
                      {assignedModel?.name || 'По умолчанию'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {assignedModel?.parametersCount}
                  </span>
                </div>

                {/* Tools Allowed */}
                <div className="mt-3 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Разрешенные инструменты:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.permittedTools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-mono bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectAgent(agent)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? 'Активен в чате' : 'Выбрать агента'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit(agent)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md"
                    title="Редактировать агента и аватар"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteAgent(agent.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-md"
                    title="Удалить агента"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Avatar Studio & Agent Configuration Modal (Section 4 refactored domain-modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveForm}
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-slate-100 text-sm">
                  {editingAgent ? 'Редактирование агента' : 'Создание нового агента'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {/* Avatar Studio Section */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">
                Студия аватара и цвета роли
              </span>

              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 transition-colors"
                  style={{ backgroundColor: formAvatarColor }}
                >
                  {formName ? formName.slice(0, 2) : 'PQ'}
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 block">Палитра акцента:</span>
                  <div className="flex items-center gap-2">
                    {COLOR_PALETTE.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormAvatarColor(color)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          formAvatarColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Имя агента *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Например: PQ-Рефакторер"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Роль и специализация
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Например: Анализ производительности"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Назначенная модель
                </label>
                <select
                  value={formModelId}
                  onChange={(e) => setFormModelId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.parametersCount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Системный промпт (Инструкция агента)
                </label>
                <textarea
                  rows={4}
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-sans focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Температура модели (Креативность)</span>
                  <span className="font-mono text-cyan-400">{formTemperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formTemperature}
                  onChange={(e) => setFormTemperature(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-2">
                  Разрешенные инструменты (Tools Permission)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_TOOLS.map((tool) => {
                    const isChecked = formTools.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => handleToggleTool(tool)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-colors ${
                          isChecked
                            ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                            isChecked ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{tool}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium"
              >
                {editingAgent ? 'Сохранить изменения' : 'Создать агента'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
