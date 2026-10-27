import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  SlidersHorizontal,
  Info,
  Trash2,
  Edit2,
  FileText,
  AlertOctagon,
  ExternalLink,
  Terminal,
  Shield,
  Layers,
  Check,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import { Project, EnvironmentType, Task, SSHConnection } from '../../types';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  sshConnections: SSHConnection[];
  activeProject: Project | null;
  onSelectProject: (p: Project) => void;
  onSaveProject: (p: Partial<Project> & { id?: string }) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleChatProject: (projectId: string) => void;
  onOpenMemory: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  sshConnections,
  activeProject,
  onSelectProject,
  onSaveProject,
  onDeleteProject,
  onToggleChatProject,
  onOpenMemory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState<'all' | EnvironmentType>('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedInfoProject, setSelectedInfoProject] = useState<Project | null>(null);

  // Cascade protection modal state (Section 7)
  const [conflictModalData, setConflictModalData] = useState<{
    project: Project;
    linkedTasks: Task[];
  } | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formEnv, setFormEnv] = useState<EnvironmentType>('local');
  const [formWorkingDir, setFormWorkingDir] = useState('');
  const [formSshId, setFormSshId] = useState('');
  const [formGithubUrl, setFormGithubUrl] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnv = envFilter === 'all' || p.environment === envFilter;
    return matchesSearch && matchesEnv;
  });

  const handleStartCreate = () => {
    setFormTitle('');
    setFormDesc('');
    setFormEnv('local');
    setFormWorkingDir('./');
    setFormSshId(sshConnections[0]?.id || '');
    setFormGithubUrl('');
    setFormLogoUrl('');
    setEditingProject(null);
    setIsCreatingNew(true);
  };

  const handleStartEdit = (p: Project) => {
    setFormTitle(p.title);
    setFormDesc(p.description);
    setFormEnv(p.environment);
    setFormWorkingDir(p.workingDir);
    setFormSshId(p.sshConnectionId || sshConnections[0]?.id || '');
    setFormGithubUrl(p.githubRepoUrl || '');
    setFormLogoUrl(p.logoUrl || '');
    setEditingProject(p);
    setIsCreatingNew(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingProject) {
      onSaveProject({
        id: editingProject.id,
        title: formTitle.trim(),
        description: formDesc.trim(),
        environment: formEnv,
        workingDir: formWorkingDir.trim() || './',
        sshConnectionId: formEnv === 'ssh' ? formSshId : undefined,
        githubRepoUrl: formEnv === 'github' ? formGithubUrl.trim() : undefined,
        logoUrl: formLogoUrl.trim() || undefined,
      });
    } else {
      onSaveProject({
        title: formTitle.trim(),
        description: formDesc.trim(),
        environment: formEnv,
        workingDir: formWorkingDir.trim() || './',
        sshConnectionId: formEnv === 'ssh' ? formSshId : undefined,
        githubRepoUrl: formEnv === 'github' ? formGithubUrl.trim() : undefined,
        logoUrl: formLogoUrl.trim() || undefined,
        isInChat: true,
        memory: {
          summary: 'Новый рабочий контекст проекта.',
          constraints: ['Соблюдать изоляцию директории.'],
          tasksNotes: '',
          agentsNotes: '',
          lastUpdated: 'Только что создан',
        },
      });
    }
    setIsCreatingNew(false);
  };

  // Section 7: Safe delete check with HTTP 409 simulation
  const handleDeleteAttempt = (p: Project) => {
    const linked = tasks.filter((t) => t.projectId === p.id);
    if (linked.length > 0) {
      // Trigger HTTP 409 Conflict Modal
      setConflictModalData({
        project: p,
        linkedTasks: linked,
      });
      return;
    }

    if (window.confirm(`Вы уверены, что хотите полностью удалить проект «${p.title}»?`)) {
      onDeleteProject(p.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Проекты и Память</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              ({projects.length})
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Контейнеры рабочего контекста, связанных задач и долгосрочной памяти ИИ-агентов
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Создать проект</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Поиск по названию или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter buttons - Zero-pill discipline: Segmented interactive controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setEnvFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              envFilter === 'all'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Все среды
          </button>
          <button
            onClick={() => setEnvFilter('local')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              envFilter === 'local'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            local
          </button>
          <button
            onClick={() => setEnvFilter('github')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              envFilter === 'github'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            github
          </button>
          <button
            onClick={() => setEnvFilter('ssh')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              envFilter === 'ssh'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ssh
          </button>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const linkedTasks = tasks.filter((t) => t.projectId === project.id);
          const isCurrentActive = activeProject?.id === project.id;

          return (
            <div
              key={project.id}
              className={`bg-slate-900 border rounded-xl p-4 transition-all flex flex-col justify-between group ${
                isCurrentActive
                  ? 'border-cyan-500/60 shadow-lg shadow-cyan-950/20 bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/80'
              }`}
            >
              <div>
                {/* Date above title in small grey text (Section 4 & 7) */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span>Создан: {project.createdAt}</span>
                    <span>·</span>
                    <span className="font-mono uppercase text-cyan-400">{project.environment}</span>
                  </div>

                  <button
                    onClick={() => setSelectedInfoProject(project)}
                    className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
                    title="Полные сведения о проекте"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Main: 80x80 px logo on the left (Section 7) */}
                <div className="flex items-start gap-3.5 mt-1">
                  <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                    {project.logoUrl ? (
                      <img
                        src={project.logoUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FolderGit2 className="w-8 h-8 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2
                        onClick={() => onSelectProject(project)}
                        className="text-sm font-semibold text-slate-100 hover:text-cyan-400 cursor-pointer truncate transition-colors"
                        title={project.title}
                      >
                        {project.title}
                      </h2>
                      {isCurrentActive && (
                        <span className="text-[10px] text-cyan-400 font-mono">
                          (активен)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-2 text-[11px] font-mono text-slate-500 truncate flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-slate-600 shrink-0" />
                      <span className="truncate">{project.workingDir}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Metadata and Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{linkedTasks.length} задач</span>
                  <span>·</span>
                  <span>{project.memory.constraints.length} правил памяти</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Memory Drawer button */}
                  <button
                    onClick={() => onOpenMemory(project)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md transition-colors"
                    title="Управление долгосрочной памятью проекта"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Память</span>
                  </button>

                  {/* Toggle Chat workspace inclusion */}
                  <button
                    onClick={() => onToggleChatProject(project.id)}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors ${
                      project.isInChat
                        ? 'text-cyan-400 hover:bg-slate-800'
                        : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                    }`}
                    title={project.isInChat ? 'Убрать из чата (сохранив глобально)' : 'Подключить к чату'}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {project.isInChat ? 'В чате' : 'Подкл.'}
                    </span>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleStartEdit(project)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                    title="Редактировать проект"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete (Protected by Section 7) */}
                  <button
                    onClick={() => handleDeleteAttempt(project)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-md transition-colors"
                    title="Удалить проект глобально"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
          <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-slate-300">Проекты не найдены</h3>
          <p className="text-xs text-slate-500 mt-1">Попробуйте изменить поисковый запрос или фильтр среды.</p>
        </div>
      )}

      {/* Info Modal */}
      {selectedInfoProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-slate-100 text-sm">Сведения о проекте</h3>
              <button
                onClick={() => setSelectedInfoProject(null)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Название:</span>
                <span className="text-slate-200 font-semibold">{selectedInfoProject.title}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Дата создания:</span>
                <span className="text-slate-200 font-mono">{selectedInfoProject.createdAt}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Тип среды:</span>
                <span className="text-cyan-400 font-mono uppercase">{selectedInfoProject.environment}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Рабочий каталог (working_dir):</span>
                <span className="text-slate-200 font-mono bg-slate-950 p-1.5 rounded block truncate mt-0.5 border border-slate-800">
                  {selectedInfoProject.workingDir}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Описание:</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed">{selectedInfoProject.description}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedInfoProject(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HTTP 409 Conflict Safety Protection Modal (Section 7) */}
      {conflictModalData && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-600 rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-950 border border-rose-700 text-rose-400">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block font-bold">
                  HTTP 409 Conflict · Защита целостности данных
                </span>
                <h3 className="text-base font-semibold text-slate-100 mt-0.5">
                  Отказ удаления проекта
                </h3>
              </div>
            </div>

            <div className="bg-rose-950/40 border border-rose-800/70 rounded-lg p-3.5 text-xs text-rose-200 space-y-2">
              <p className="font-medium text-slate-100">
                Нельзя удалить проект, к которому привязаны задачи. Сначала удалите или переназначьте задачи
              </p>
              <p className="text-[11px] text-slate-400">
                К проекту «<strong>{conflictModalData.project.title}</strong>» привязано {conflictModalData.linkedTasks.length} задач(и).
                Удаление проекта приведёт к нарушению внешних ключей.
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Связанные задачи:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {conflictModalData.linkedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-950 text-xs border border-slate-800"
                  >
                    <span className="text-slate-200 truncate">{t.title}</span>
                    <span className="text-[10px] text-amber-400 font-mono shrink-0 ml-2">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setConflictModalData(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-medium transition-colors"
              >
                Понятно (Операция отклонена)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal with Environment Fields (Section 8) */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveForm}
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-slate-100 text-base">
                  {editingProject ? 'Редактировать проект' : 'Создать новый проект'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {/* Date above title pattern */}
            <div className="text-[11px] text-slate-500 font-mono">
              {editingProject ? `Создан: ${editingProject.createdAt}` : 'Новая сущность'}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Название проекта *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Например: Core Agent Engine"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Описание назначения
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Краткое описание функций проекта..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Environment selector (Section 8: local, github, ssh) */}
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Тип среды проекта (Environment)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormEnv('local')}
                    className={`py-2 text-xs font-mono font-medium rounded-lg border transition-colors ${
                      formEnv === 'local'
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    local
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormEnv('github')}
                    className={`py-2 text-xs font-mono font-medium rounded-lg border transition-colors ${
                      formEnv === 'github'
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    github
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormEnv('ssh')}
                    className={`py-2 text-xs font-mono font-medium rounded-lg border transition-colors ${
                      formEnv === 'ssh'
                        ? 'border-amber-500 bg-amber-950/40 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ssh
                  </button>
                </div>
              </div>

              {/* Working directory field */}
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Рабочий каталог (working_dir)
                </label>
                <input
                  type="text"
                  value={formWorkingDir}
                  onChange={(e) => setFormWorkingDir(e.target.value)}
                  placeholder="./ или C:/PQlocalAgentOSv3/backend"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Команды агента будут запускаться с переходом в этот каталог.
                </span>
              </div>

              {/* Conditional SSH Connection Field */}
              {formEnv === 'ssh' && (
                <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg space-y-2">
                  <label className="text-amber-300 font-medium block">
                    Выбор SSH-подключения (Paramiko)
                  </label>
                  <select
                    value={formSshId}
                    onChange={(e) => setFormSshId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {sshConnections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.username}@{c.host}:{c.port})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional GitHub Field */}
              {formEnv === 'github' && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg space-y-2">
                  <label className="text-emerald-300 font-medium block">
                    URL репозитория GitHub
                  </label>
                  <input
                    type="url"
                    value={formGithubUrl}
                    onChange={(e) => setFormGithubUrl(e.target.value)}
                    placeholder="https://github.com/alexpikman/PQlocalAgentOSv3"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Агент будет использовать конкретный репозиторий проекта вместо глобального.
                  </span>
                </div>
              )}

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  URL логотипа (отображается 80x80 px)
                </label>
                <input
                  type="url"
                  value={formLogoUrl}
                  onChange={(e) => setFormLogoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Sandbox notice */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-start gap-2 text-[11px] text-slate-400">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Внимание:</strong> рабочая директория не изолирует файловую систему
                  аппаратно. Следите за правами доступа запускаемых агентами процессов.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium"
              >
                {editingProject ? 'Сохранить изменения' : 'Создать проект'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
