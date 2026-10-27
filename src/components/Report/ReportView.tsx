import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  GitCommit,
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ROADMAP_ITEMS, COMMITS_LOG, RoadmapItem } from '../../data/reportData';

export const ReportView: React.FC = () => {
  const [items, setItems] = useState<RoadmapItem[]>(ROADMAP_ITEMS);
  const [selectedPrio, setSelectedPrio] = useState<'all' | 'P0' | 'P1' | 'P2' | 'P3' | 'P4'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sec1: true,
    sec2: true,
    sec3: true,
    sec7: true,
    sec8: true,
    sec10: true,
    sec14: true,
    sec15: true,
  });

  const toggleItemDone = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it))
    );
  };

  const toggleSection = (sec: string) => {
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const filteredRoadmap = items.filter((item) => {
    const matchesPrio = selectedPrio === 'all' || item.category === selectedPrio;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPrio && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>Репозиторий: alexpikman/PQlocalAgentOSv3</span>
            <span>·</span>
            <span>Ветка: main</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>PQlocalAgentOSv3 — Полный отчёт по проекту</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Архитектурный статус, матрица статической верификации и приоритетный план работ (P0—P4)
          </p>
        </div>

        <a
          href="https://github.com/alexpikman/PQlocalAgentOSv3"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <GitCommit className="w-4 h-4 text-cyan-400" />
          <span>GitHub Репозиторий</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>
      </div>

      {/* Progress & Verification Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Прогресс дорожной карты и статус верификации</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Выполнено {completedCount} из {items.length} приоритетных задач плана
            </p>
          </div>

          <span className="text-lg font-mono font-bold text-cyan-400">{progressPercent}%</span>
        </div>

        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Status Callout (from Section 14) */}
        <div className="p-3.5 bg-slate-950/70 border border-amber-600/40 rounded-lg text-xs leading-relaxed text-slate-300 space-y-1">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Официальный статус проекта (Раздел 14):</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            <strong>Активная разработка с рядом реализованных компонентов и отдельными статическими проверками; полная интеграционная готовность не подтверждена.</strong>{' '}
            Наличие серверного API и клиентской логики не заменяет тестового прогона на целевой Windows-машине с Ollama и GGUF.
          </p>
        </div>
      </div>

      {/* Interactive P0—P4 Roadmap Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Приоритетный план дальнейшей работы (Раздел 15)</span>
          </h2>

          {/* Priority filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['all', 'P0', 'P1', 'P2', 'P3', 'P4'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPrio(p)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors ${
                  selectedPrio === p
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p === 'all' ? 'Все' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Roadmap items list */}
        <div className="divide-y divide-slate-800">
          {filteredRoadmap.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-start gap-3 hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItemDone(item.id)}
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-600 focus:ring-0 cursor-pointer"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400">
                    {item.category}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      item.completed ? 'text-slate-400 line-through' : 'text-slate-200'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                  item.verificationType === 'static_verified'
                    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                    : 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                }`}
              >
                {item.verificationType === 'static_verified'
                  ? 'Статически проверено'
                  : 'Требует Windows/Ollama'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Commits Reference (from Section 7 & 8) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-cyan-400" />
          <span>Ключевые коммиты проекта и подтверждённые исправления</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {COMMITS_LOG.map((c) => (
            <div
              key={c.hash}
              className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <a
                  href={`https://github.com/alexpikman/PQlocalAgentOSv3/commit/${c.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>{c.hash}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
                <span className="text-[10px] font-mono text-emerald-400">{c.status}</span>
              </div>
              <div className="text-xs font-medium text-slate-200">{c.title}</div>
              <div className="text-[11px] text-slate-400 leading-relaxed">{c.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion Sections from Full Report (1-16) */}
      <div className="space-y-3">
        {/* Section 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('sec1')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
          >
            <span className="font-semibold text-xs text-slate-200">
              1. Идея и исходные цели
            </span>
            {expandedSections.sec1 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedSections.sec1 && (
            <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3 space-y-2">
              <p>
                PQlocalAgentOSv3 задумывается как локальная рабочая среда для управления ИИ-моделями,
                агентами, проектами и задачами. Это не просто чат с моделью и не обычная панель
                управления проектами: интерфейс должен позволять организовать работу локальных
                ИИ-инструментов, видеть состояние системы, управлять контекстом и расширять
                возможности через отдельные модули.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li><strong>Local-first:</strong> работа с локальными провайдерами без обязательного платного API.</li>
                <li><strong>Модульность:</strong> функциональные области подключаются к общей системе.</li>
                <li><strong>Единая структура интерфейса:</strong> согласованные паттерны списков и модальных окон.</li>
                <li><strong>Русскоязычный интерфейс:</strong> интуитивные названия действий и состояний.</li>
                <li><strong>Безопасность и предсказуемость:</strong> удаление сущностей не уничтожает связанные данные.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Section 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('sec2')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
          >
            <span className="font-semibold text-xs text-slate-200">
              2. Архитектура, организация кода и 7 CSS-слоёв
            </span>
            {expandedSections.sec2 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedSections.sec2 && (
            <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3 space-y-2">
              <p>
                Python-бэкенд на FastAPI с локальным веб-интерфейсом. Данные организованы через файлы
                в каталоге <code className="text-cyan-300 font-mono">data/</code>.
              </p>
              <div className="font-mono text-[11px] bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
                <div>1. <strong>Tokens</strong> — переменные, размеры, цвета.</div>
                <div>2. <strong>Base</strong> — базовые правила элементов и типографики.</div>
                <div>3. <strong>Shell</strong> — каркас приложения и раскладка.</div>
                <div>4. <strong>Components</strong> — UI-компоненты и кнопки.</div>
                <div>5. <strong>Patterns</strong> — повторяемые паттерны (списки list-entity, карточки).</div>
                <div>6. <strong>Sections</strong> — стили конкретных разделов.</div>
                <div>7. <strong>Responsive</strong> — адаптация под экраны.</div>
              </div>
            </div>
          )}
        </div>

        {/* Section 7 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('sec7')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
          >
            <span className="font-semibold text-xs text-slate-200">
              7. Проекты, память и защита связанных задач (HTTP 409)
            </span>
            {expandedSections.sec7 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedSections.sec7 && (
            <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3 space-y-2">
              <p>
                В серверной обработке удаления проекта добавлена проверка связанных задач. Если задачи
                ссылаются на проект через <code className="text-cyan-300 font-mono">project_id</code> или{' '}
                <code className="text-cyan-300 font-mono">projectId</code>, сервер отклоняет удаление со статусом
                HTTP 409:
              </p>
              <div className="bg-rose-950/40 border border-rose-800 p-2.5 rounded text-rose-200 text-xs italic">
                «Нельзя удалить проект, к которому привязаны задачи. Сначала удалите или переназначьте задачи»
              </div>
              <p>
                В чате действие для проекта изменено на <strong>«Убрать из чата»</strong>. Оно отвязывает
                проект от локального рабочего пространства диалога, не вызывая серверное удаление.
              </p>
            </div>
          )}
        </div>

        {/* Section 8 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('sec8')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
          >
            <span className="font-semibold text-xs text-slate-200">
              8. Типы среды проекта: local, github, ssh
            </span>
            {expandedSections.sec8 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedSections.sec8 && (
            <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3 space-y-2">
              <p>
                Введено 3 типа сред. Старые проекты получают <code className="text-cyan-300 font-mono">local</code> по умолчанию.
                Для SSH-среды агенту передаются данные подключения и рабочий каталог. Команды начинаются с перехода в настроенный рабочий каталог с корректным экранированием пути.
              </p>
              <div className="bg-amber-950/30 border border-amber-800/40 p-2.5 rounded text-amber-300 text-[11px]">
                <strong>Ограничение безопасности:</strong> working_dir не является аппаратной песочницей.
                Произвольная команда может выйти за пределы указанной папки при наличии прав у процесса.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
