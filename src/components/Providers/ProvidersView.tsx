import React, { useState } from 'react';
import {
  Cpu,
  Server,
  Cloud,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Terminal,
  ShieldAlert,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Provider, Model } from '../../types';

interface ProvidersViewProps {
  providers: Provider[];
  models: Model[];
  onRefreshProvider: (providerId: string) => void;
}

export const ProvidersView: React.FC<ProvidersViewProps> = ({
  providers,
  models,
  onRefreshProvider,
}) => {
  const [activeTab, setActiveTab] = useState<'local' | 'cloud' | 'gguf'>('local');
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [selectedGgufModel, setSelectedGgufModel] = useState<Model | null>(
    models.find((m) => m.isGguf) || null
  );

  const localProviders = providers.filter((p) => p.type !== 'cloud');
  const cloudProviders = providers.filter((p) => p.type === 'cloud');

  const handleRefresh = (id: string) => {
    setRefreshingId(id);
    onRefreshProvider(id);
    setTimeout(() => {
      setRefreshingId(null);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <span>Провайдеры и Модели</span>
          <span className="text-xs font-mono font-normal text-slate-400">
            ({models.length} доступно)
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Конфигурация локальных серверов (Ollama, LM Studio), облачных API и инференса GGUF
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start">
        <button
          onClick={() => setActiveTab('local')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'local'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Локальные провайдеры ({localProviders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'cloud'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Облачные модели</span>
        </button>

        <button
          onClick={() => setActiveTab('gguf')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'gguf'
              ? 'bg-slate-800 text-amber-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Файловые GGUF и DLL статус</span>
        </button>
      </div>

      {/* TAB 1: Local Providers & Models */}
      {activeTab === 'local' && (
        <div className="space-y-6">
          {/* Providers List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {localProviders.map((provider) => {
              const isRefreshing = refreshingId === provider.id;

              return (
                <div
                  key={provider.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            provider.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                          }`}
                        />
                        <h3 className="text-xs font-semibold text-slate-100">{provider.name}</h3>
                      </div>
                      <button
                        onClick={() => handleRefresh(provider.id)}
                        className="text-slate-500 hover:text-cyan-400 p-1"
                        title="Проверить статус подключения"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-800/80 truncate">
                      {provider.baseUrl}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Моделей:{' '}
                      <strong className="text-slate-200 font-mono">{provider.modelsCount}</strong>
                    </span>
                    <span className="text-slate-500 font-mono">
                      {provider.status === 'online' ? `${provider.latencyMs} мс` : 'Нет ответа'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Models Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Загруженные модели локальных провайдеров
              </h3>
              <span className="text-[11px] text-slate-500">
                * Подпись скорректирована: число параметров вместо «токенов» (Раздел 5)
              </span>
            </div>

            <div className="divide-y divide-slate-800 border-t border-slate-800">
              {models
                .filter((m) => !m.isGguf && m.providerId !== 'prov-cloud')
                .map((model) => {
                  const prov = providers.find((p) => p.id === model.providerId);

                  return (
                    <div
                      key={model.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">{model.name}</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-1.5 py-0.2 rounded">
                            {model.parametersCount}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Провайдер: {prov?.name}</span>
                          <span>·</span>
                          <span>Контекст: {model.contextLength}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                          Готова к инференсу
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Cloud Models */}
      {activeTab === 'cloud' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  <span>Облачный шлюз Gemini & OpenAI-compatible</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Используется для тяжелых задач анализа, RAG и генерации архитектурных планов.
                  Ключ API безопасно передаётся через переменную окружения окружения сервера без
                  сохранения в открытом виде.
                </p>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800">
                Авторизован
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Эндпоинт:</span>
                <span className="font-mono text-slate-200">
                  https://generativelanguage.googleapis.com
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Модель по умолчанию:</span>
                <span className="font-mono text-cyan-400">gemini-2.5-flash / gemini-2.5-pro</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Окно контекста:</span>
                <span className="font-mono text-slate-200">1 000 000 токенов</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GGUF Files & Windows llama.dll status (Section 5) */}
      {activeTab === 'gguf' && (
        <div className="space-y-4">
          {/* Architectural fix banner */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-950 border border-amber-800 text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-100">
                  Маршрутизация локальных GGUF-моделей (Исправление HTTP 404)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Путь к файлу <code className="bg-slate-950 text-slate-200 px-1 py-0.5 rounded font-mono">.gguf</code>{' '}
                  нельзя отправлять как URL HTTP API Ollama или облачного провайдера. В ядре v3
                  маршрутизатор разделяет вызовы: локальные файлы передаются в отдельный C++ runtime,
                  а не в HTTP сетевой стек.
                </p>
              </div>
            </div>
          </div>

          {/* Windows llama.dll Troubleshooting Diagnostic Card */}
          <div className="p-5 bg-slate-900 border border-amber-600/50 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Диагностика llama-cpp-python и зависимостей llama.dll (Windows)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                Требует подтверждения на целевой машине
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              На Windows частая проблема инференса GGUF — ошибка загрузки <code className="text-amber-300 font-mono">llama.dll</code> или
              её системных библиотек. Успешный HTTP-роутинг не означает, что библиотека C++ уже
              успешно загружена в память.
            </p>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-400 font-semibold mb-1">
                Чеклист устранения ошибки загрузки llama.dll:
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>1. Установка Microsoft Visual C++ 2015-2022 Redistributable (x64)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2. Добавление каталога с DLL в PATH перед `import llama_cpp`</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>3. Проверка сборки llama-cpp-python с нужным бекендом (CPU / CUDA / Vulkan)</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-500 block mb-1">
                  Рекомендуемая команда переустановки в виртуальное окружение:
                </span>
                <div className="bg-slate-900 p-2 rounded text-[11px] font-mono text-cyan-300 overflow-x-auto">
                  pip install --force-reinstall --no-cache-dir llama-cpp-python
                </div>
              </div>
            </div>

            {/* GGUF model in repository */}
            {selectedGgufModel && (
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Файл модели:</span>
                  <span className="font-mono text-slate-200">{selectedGgufModel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Путь на диске:</span>
                  <span className="font-mono text-cyan-400 truncate max-w-xs">{selectedGgufModel.filePath}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Параметры квантования:</span>
                  <span className="font-mono text-slate-300">Q4_K_M (7B параметров)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
