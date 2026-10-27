import React, { useState } from 'react';
import {
  Menu,
  Server,
  Sliders,
  Moon,
  Sun,
  Laptop,
  ShieldCheck,
  AlertCircle,
  FileText,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import { ActiveNavTab, ThemeMode } from '../../types';

interface HeaderProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  leftSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  rightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
  serverOnline: boolean;
  onToggleServerOnline: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  themeMode?: ThemeMode;
  onSelectThemeMode?: (mode: ThemeMode) => void;
  shellPaddingX: number;
  shellPaddingY: number;
  onUpdatePadding: (x: number, y: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  leftSidebarOpen,
  onToggleLeftSidebar,
  rightSidebarOpen,
  onToggleRightSidebar,
  serverOnline,
  onToggleServerOnline,
  isDarkMode,
  onToggleDarkMode,
  themeMode = 'dark',
  onSelectThemeMode,
  shellPaddingX,
  shellPaddingY,
  onUpdatePadding,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Рабочий стол (Dashboard)';
      case 'chat':
        return 'Чат с агентами';
      case 'system_map':
        return 'Карта системы и Потоки данных';
      case 'projects':
        return 'Проекты и Память';
      case 'tasks':
        return 'Задачи и Канбан';
      case 'agents':
        return 'AI-Агенты и Аватар-студия';
      case 'providers':
        return 'Провайдеры и Модели';
      case 'terminal':
        return 'Интерактивный Терминал';
      case 'diagnostics':
        return 'Диагностика и Телеметрия';
      case 'environments':
        return 'Среды и SSH-подключения';
      case 'permissions':
        return 'Разрешения и Безопасность';
      case 'modules':
        return 'Модули и Графовый конвейер';
      case 'audit':
        return 'Аудит ядра (audit_checks)';
      case 'report':
        return 'Полный отчёт и План (P0—P4)';
      default:
        return 'Рабочая среда';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-5 py-3 transition-colors">
        {/* Left: Sidebar toggle, PQ logo, breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLeftSidebar}
            aria-label="Переключить боковую панель"
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 rounded-md transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* PQ Logo with pulse animation */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none mr-2"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs tracking-wider shadow-sm pq-logo-active">
              PQ
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors">
                PQlocalAgentOS
                <span className="ml-1 text-xs font-mono font-bold text-cyan-400">v4</span>
              </span>
              <span className="text-[10px] text-slate-500 -mt-0.5">Next-Gen AI Workspace</span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden md:block" />

          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="hover:text-slate-200 transition-colors"
            >
              Control Center
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-medium">{getBreadcrumbTitle()}</span>
          </nav>
        </div>

        {/* Right: Server Status, Refresh, Settings, Theme, Right Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Server status pill button */}
          <button
            onClick={onToggleServerOnline}
            title={serverOnline ? 'Сервер активен (нажмите для симуляции сбоя)' : 'Сервер отключен (нажмите для возобновления)'}
            className={`flex items-center gap-2 px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
              serverOnline
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className="hidden lg:inline">{serverOnline ? 'Python 127.0.0.1:8765 (0.4мс)' : 'Сервер: Офлайн'}</span>
            <span className="lg:hidden">{serverOnline ? 'Онлайн' : 'Офлайн'}</span>
          </button>

          {/* Refresh state */}
          <button
            onClick={handleRefresh}
            title="Обновить состояние"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 rounded-md transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Classic v3 UI link */}
          <a
            href="/classic"
            target="_blank"
            rel="noopener noreferrer"
            title="Открыть классический HTML-интерфейс v3 (/classic)"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">v3 Classic</span>
          </a>

          {/* Audit quick link */}
          <button
            onClick={() => onSelectTab('audit')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
              activeTab === 'audit'
                ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                : 'border-slate-800 text-slate-300 hover:bg-slate-800/70 hover:text-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Аудит ядра</span>
          </button>

          {/* Layout Settings */}
          <button
            onClick={() => setShowSettingsModal(true)}
            title="Настройки интерфейса, темы и отступов"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 rounded-md transition-colors"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Quick theme toggle */}
          <button
            onClick={onToggleDarkMode}
            title={
              isDarkMode
                ? 'Текущая тема: Тёмная. Нажмите для включения Светлой (Мягкий серо-голубой)'
                : 'Текущая тема: Светлая. Нажмите для включения Тёмной'
            }
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 rounded-md transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-500" />
            )}
          </button>

          {/* Right sidebar toggle */}
          <button
            onClick={onToggleRightSidebar}
            title="Контекстная панель"
            className={`p-1.5 rounded-md transition-colors ${
              rightSidebarOpen
                ? 'bg-slate-800 text-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <GitBranch className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Offline Alert Banner if simulated offline */}
      {!serverOnline && (
        <div className="bg-rose-950/80 border-b border-rose-800/50 px-5 py-2.5 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Локальный сервер Python/FastAPI недоступен.</strong> Проверьте запуск{' '}
              <code className="bg-rose-900/60 px-1.5 py-0.5 rounded text-rose-100 font-mono">
                python server.py
              </code>{' '}
              на порту 8765.
            </span>
          </div>
          <button
            onClick={onToggleServerOnline}
            className="px-2.5 py-1 bg-rose-800 hover:bg-rose-700 text-rose-100 rounded text-xs font-medium transition-colors"
          >
            Возобновить
          </button>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-slate-100 text-base">
                  Настройки каркаса PQlocalAgentOSv4
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* Theme Selection Section */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  Тема оформления интерфейса:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectThemeMode?.('dark')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      themeMode === 'dark'
                        ? 'bg-slate-800 border-cyan-500 text-cyan-400 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-cyan-400" />
                    <span>Тёмная</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectThemeMode?.('light')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      themeMode === 'light'
                        ? 'bg-slate-800 border-cyan-500 text-cyan-400 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Светлая</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectThemeMode?.('system')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      themeMode === 'system'
                        ? 'bg-slate-800 border-cyan-500 text-cyan-400 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Laptop className="w-4 h-4 text-slate-400" />
                    <span>Системная</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Светлая палитра: мягкий серо-голубой контраст (slate/blue-gray) для комфортной продолжительной работы.
                </p>
              </div>

              {/* Padding controls */}
              <div>
                <p className="text-xs text-slate-400 mb-3">
                  Целевые параметры отступов каркаса: верх/низ —{' '}
                  <span className="text-slate-200 font-mono">24 px</span>, боковой —{' '}
                  <span className="text-slate-200 font-mono">22 px</span>.
                </p>

                <div className="space-y-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Вертикальный отступ (Y)</span>
                      <span className="font-mono text-cyan-400">{shellPaddingY} px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="40"
                      step="2"
                      value={shellPaddingY}
                      onChange={(e) => onUpdatePadding(shellPaddingX, Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Боковой отступ (X)</span>
                      <span className="font-mono text-cyan-400">{shellPaddingX} px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="36"
                      step="2"
                      value={shellPaddingX}
                      onChange={(e) => onUpdatePadding(Number(e.target.value), shellPaddingY)}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => onUpdatePadding(22, 24)}
                    className="w-full text-center text-xs text-slate-400 hover:text-cyan-400 py-1 transition-colors"
                  >
                    Сбросить к каноническим (24px / 22px)
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  Принципы 7-слойной CSS-архитектуры:
                </span>
                <div className="text-[11px] text-slate-400 font-mono space-y-1 bg-slate-950/40 p-3 rounded border border-slate-800/50">
                  <div>1. Tokens (переменные, размеры, цвета)</div>
                  <div>2. Base (базовые правила и типографика)</div>
                  <div>3. Shell (каркас и сетка страниц)</div>
                  <div>4. Components (кнопки, поля, карточки)</div>
                  <div>5. Patterns (списки list-entity, модальные окна)</div>
                  <div>6. Sections (страничные стили)</div>
                  <div>7. Responsive (адаптивность)</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Применить и закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
