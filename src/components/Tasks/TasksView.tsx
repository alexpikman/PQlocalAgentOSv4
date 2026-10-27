import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  FolderGit2,
  Trash2,
  Edit2,
  Info,
  Kanban,
  List as ListIcon,
  AlertCircle,
} from 'lucide-react';
import { Task, Project, Agent, TaskStatus, TaskPriority } from '../../types';

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  agents: Agent[];
  onSaveTask: (task: Partial<Task> & { id?: string }) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  projects,
  agents,
  onSaveTask,
  onDeleteTask,
  onUpdateStatus,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfoTask, setSelectedInfoTask] = useState<Task | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formProjectId, setFormProjectId] = useState('');
  const [formAgentId, setFormAgentId] = useState('');
  const [formStatus, setFormStatus] = useState<TaskStatus>('queued');
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium');
  const [formDueDate, setFormDueDate] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = projectFilter === 'all' || t.projectId === projectFilter;
    return matchesSearch && matchesProject;
  });

  const handleStartCreate = () => {
    setFormTitle('');
    setFormDesc('');
    setFormProjectId(projects[0]?.id || '');
    setFormAgentId(agents[0]?.id || '');
    setFormStatus('queued');
    setFormPriority('medium');
    setFormDueDate('');
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleStartEdit = (t: Task) => {
    setFormTitle(t.title);
    setFormDesc(t.description);
    setFormProjectId(t.projectId);
    setFormAgentId(t.assignedAgentId);
    setFormStatus(t.status);
    setFormPriority(t.priority);
    setFormDueDate(t.dueDate || '');
    setEditingTask(t);
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      onSaveTask({
        id: editingTask.id,
        title: formTitle.trim(),
        description: formDesc.trim(),
        projectId: formProjectId,
        assignedAgentId: formAgentId,
        status: formStatus,
        priority: formPriority,
        dueDate: formDueDate || undefined,
      });
    } else {
      onSaveTask({
        title: formTitle.trim(),
        description: formDesc.trim(),
        projectId: formProjectId,
        assignedAgentId: formAgentId,
        status: formStatus,
        priority: formPriority,
        dueDate: formDueDate || undefined,
        createdAt: 'Сегодня',
      });
    }
    setIsModalOpen(false);
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return { label: 'Критический', color: 'text-rose-400 font-semibold' };
      case 'high':
        return { label: 'Высокий', color: 'text-amber-400' };
      case 'medium':
        return { label: 'Средний', color: 'text-cyan-400' };
      case 'low':
        return { label: 'Низкий', color: 'text-slate-400' };
    }
  };

  const columns: { status: TaskStatus; title: string }[] = [
    { status: 'queued', title: 'В очереди' },
    { status: 'in_progress', title: 'В работе' },
    { status: 'review', title: 'Проверка' },
    { status: 'done', title: 'Завершено' },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Задачи и Очередь</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              ({tasks.length})
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Операционные задачи агентов с привязкой к контексту проектов
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-slate-800 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Канбан-доска"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-800 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Табличный список"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleStartCreate}
            className="flex items-center gap-2 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Создать задачу</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Поиск по названию или описанию задачи..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 shrink-0">Проект:</span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Все проекты ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{col.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const agent = agents.find((a) => a.id === task.assignedAgentId);
                    const prio = getPriorityLabel(task.priority);

                    return (
                      <div
                        key={task.id}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-lg p-3 transition-all space-y-2.5 group shadow-sm"
                      >
                        {/* Date above title pattern (Section 4) */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>Создана: {task.createdAt}</span>
                          <span className={`font-mono ${prio.color}`}>{prio.label}</span>
                        </div>

                        {/* Title & Info */}
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="text-xs font-semibold text-slate-200 leading-snug">
                            {task.title}
                          </h4>
                          <button
                            onClick={() => setSelectedInfoTask(task)}
                            className="text-slate-500 hover:text-cyan-400 p-0.5 shrink-0"
                            title="Сведения о задаче"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Metadata: Project & Agent (Zero-pill text separators) */}
                        <div className="text-[10px] text-slate-500 space-y-1 pt-1 border-t border-slate-800/60">
                          <div className="flex items-center gap-1.5 truncate">
                            <FolderGit2 className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="text-slate-400 truncate">
                              {project?.title || 'Без проекта'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 truncate">
                            <User className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="text-slate-300 font-medium">
                              {agent?.name || 'Не назначен'}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons on card hover */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                          {/* Quick move state */}
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                            className="bg-slate-950 text-[10px] text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 focus:outline-none"
                          >
                            <option value="queued">Очередь</option>
                            <option value="in_progress">В работе</option>
                            <option value="review">Проверка</option>
                            <option value="done">Завершено</option>
                          </select>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEdit(task)}
                              className="p-1 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-800"
                              title="Редактировать задачу"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-950/40"
                              title="Удалить задачу"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div className="h-28 flex items-center justify-center border border-dashed border-slate-800/60 rounded-lg text-slate-600 text-xs">
                      Нет задач
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View (Explicitly NO persistent row numbers per Section 4) */}
      {viewMode === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="divide-y divide-slate-800">
            {filteredTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              const agent = agents.find((a) => a.id === task.assignedAgentId);
              const prio = getPriorityLabel(task.priority);

              return (
                <div
                  key={task.id}
                  className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    {/* Creation date above title */}
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                      <span>Создана: {task.createdAt}</span>
                      <span>·</span>
                      <span className={`font-mono ${prio.color}`}>{prio.label}</span>
                      <span>·</span>
                      <span className="text-slate-400 uppercase font-mono">{task.status}</span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-200 truncate">
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {task.description}
                    </p>

                    <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-0.5">
                      <span className="text-cyan-400 font-medium">{project?.title}</span>
                      <span>·</span>
                      <span>{agent?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                      className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded px-2 py-1"
                    >
                      <option value="queued">В очереди</option>
                      <option value="in_progress">В работе</option>
                      <option value="review">Проверка</option>
                      <option value="done">Завершено</option>
                    </select>

                    <button
                      onClick={() => handleStartEdit(task)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Modal */}
      {selectedInfoTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-slate-100 text-sm">Сведения о задаче</h3>
              <button
                onClick={() => setSelectedInfoTask(null)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Задача:</span>
                <span className="text-slate-200 font-semibold">{selectedInfoTask.title}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Дата создания:</span>
                <span className="text-slate-200 font-mono">{selectedInfoTask.createdAt}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Полное описание:</span>
                <p className="text-slate-300 leading-relaxed mt-0.5">
                  {selectedInfoTask.description}
                </p>
              </div>
              <div>
                <span className="text-slate-500 block">Привязанный проект:</span>
                <span className="text-cyan-400">
                  {projects.find((p) => p.id === selectedInfoTask.projectId)?.title}
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedInfoTask(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveForm}
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-slate-100 text-sm">
                {editingTask ? 'Редактировать задачу' : 'Создать новую задачу'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              {editingTask ? `Создана: ${editingTask.createdAt}` : 'Новая сущность'}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Название задачи *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Например: Исправить загрузку llama.dll"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Описание и критерии готовности
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Детали выполнения задачи..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Проект (Контейнер данных)
                  </label>
                  <select
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Назначенный агент
                  </label>
                  <select
                    value={formAgentId}
                    onChange={(e) => setFormAgentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Приоритет
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="critical">Критический</option>
                    <option value="high">Высокий</option>
                    <option value="medium">Средний</option>
                    <option value="low">Низкий</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Статус
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="queued">В очереди</option>
                    <option value="in_progress">В работе</option>
                    <option value="review">Проверка</option>
                    <option value="done">Завершено</option>
                  </select>
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
                {editingTask ? 'Сохранить изменения' : 'Создать задачу'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
