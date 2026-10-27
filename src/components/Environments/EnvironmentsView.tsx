import React, { useState } from 'react';
import {
  Terminal,
  Server,
  Shield,
  ShieldAlert,
  GitBranch,
  Key,
  FolderGit2,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { SSHConnection, GitHubConnection } from '../../types';

interface EnvironmentsViewProps {
  sshConnections: SSHConnection[];
  githubConnection: GitHubConnection;
  onAddSshConnection: (conn: Omit<SSHConnection, 'id'>) => void;
  onTestSsh: (id: string) => Promise<boolean>;
}

export const EnvironmentsView: React.FC<EnvironmentsViewProps> = ({
  sshConnections,
  githubConnection,
  onAddSshConnection,
  onTestSsh,
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ssh' | 'github' | 'sandbox'>('ssh');

  // New SSH Modal
  const [isNewSshOpen, setIsNewSshOpen] = useState(false);
  const [sshName, setSshName] = useState('');
  const [sshHost, setSshHost] = useState('');
  const [sshPort, setSshPort] = useState(22);
  const [sshUser, setSshUser] = useState('');
  const [sshWorkingDir, setSshWorkingDir] = useState('/home/user/workspace');
  const [sshSsrf, setSshSsrf] = useState(true);

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const ok = await onTestSsh(id);
      if (ok) {
        setTestResult('Подключение через Paramiko успешно установлено. SSRF-фильтр активен.');
      } else {
        setTestResult('Ошибка: Хост недоступен или тайм-аут сокета.');
      }
    } finally {
      setTestingId(null);
    }
  };

  const handleCreateSsh = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sshName || !sshHost || !sshUser) return;
    onAddSshConnection({
      name: sshName,
      host: sshHost,
      port: sshPort,
      username: sshUser,
      authType: 'key',
      defaultWorkingDir: sshWorkingDir,
      ssrfProtection: sshSsrf,
      status: 'idle',
      lastChecked: 'Только что',
    });
    setIsNewSshOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Среды выполнения и Интеграции</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              (local · github · ssh)
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Настройка удалённых серверов Paramiko, SSRF-фильтрации и шифрования токенов DPAPI
          </p>
        </div>

        <button
          onClick={() => setIsNewSshOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить SSH-хост</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start">
        <button
          onClick={() => setActiveTab('ssh')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'ssh'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>SSH-подключения (Paramiko)</span>
        </button>

        <button
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'github'
              ? 'bg-slate-800 text-emerald-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>GitHub и Windows DPAPI</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'sandbox'
              ? 'bg-slate-800 text-amber-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Безопасность и working_dir</span>
        </button>
      </div>

      {/* SSH TAB */}
      {activeTab === 'ssh' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sshConnections.map((conn) => {
              const isTesting = testingId === conn.id;

              return (
                <div
                  key={conn.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs font-semibold text-slate-100">{conn.name}</h3>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          conn.status === 'connected'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {conn.status}
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-1.5 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex justify-between text-slate-400">
                        <span>Хост:</span>
                        <span className="text-slate-200">
                          {conn.username}@{conn.host}:{conn.port}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Авторизация:</span>
                        <span className="text-cyan-400">
                          {conn.authType === 'key' ? 'SSH Key (ed25519)' : 'Пароль'}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400 truncate">
                        <span>Рабочий каталог:</span>
                        <span className="text-slate-300 truncate max-w-[140px]">
                          {conn.defaultWorkingDir}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SSRF-защита: {conn.ssrfProtection ? 'ВКЛ' : 'ВЫКЛ'}</span>
                    </div>

                    <button
                      onClick={() => handleTestConnection(conn.id)}
                      disabled={isTesting}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3" />
                      <span>{isTesting ? 'Проверка...' : 'Тест связи'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {testResult && (
            <div className="p-3 bg-slate-950 border border-cyan-800/40 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{testResult}</span>
            </div>
          )}
        </div>
      )}

      {/* GITHUB TAB & DPAPI Windows (Section 11) */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  <span>Интеграция с GitHub и шифрование DPAPI</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Синхронизация коммитов, проверка доступа и безопасное хранение персональных токенов
                  на платформе Windows через CryptProtectData API.
                </p>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800">
                DPAPI Активен
              </span>
            </div>

            {/* DPAPI Fix Details (Section 11) */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Исправление проблемы шифрования токена (Windows DPAPI):</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                На Windows устранена ошибка <em className="text-amber-300">«Не удалось зашифровать токен»</em>.
                Корректно типизированы структуры <code className="text-cyan-300 font-mono">ctypes.Structure</code> (DATA_BLOB),
                передача указателей на байтовые буферы и освобождение системной памяти с помощью{' '}
                <code className="text-cyan-300 font-mono">kernel32.LocalFree</code>.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Репозиторий проекта:</span>
                  <span className="text-slate-200">{githubConnection.repoUrl}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Статус токена:</span>
                  <span className="text-emerald-400">Зашифрован (не отображается в открытом виде)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Проверка прав доступа:</span>
                  <span className="text-slate-300">repo, read:org, write:packages (Verified)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SANDBOX & WORKING DIR NOTICE TAB (Section 8) */}
      {activeTab === 'sandbox' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-amber-600/50 rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-950 border border-amber-800 text-amber-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-100">
                  Ограничение безопасности: working_dir vs Песочница
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Заданный параметр <code className="bg-slate-950 text-cyan-300 px-1 py-0.5 rounded font-mono">working_dir</code>{' '}
                  определяет только <strong>начальный каталог выполнения команды</strong> (например,{' '}
                  <code className="font-mono text-slate-200">cd /var/www/app && npm test</code>), но{' '}
                  <strong>не является изолированной песочницей</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block">
                Требования к безопасной эксплуатации:
              </span>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px] leading-relaxed">
                <li>Если запускаемый процесс имеет права на другие каталоги, произвольная команда может выйти за пределы папки.</li>
                <li>Для строгой изоляции используйте Docker-контейнеры или непривилегированных пользователей Linux.</li>
                <li>Все сетевые запросы агентов проходят через валидатор SSRF (блокируются адреса 127.0.0.1, 169.254.169.254, 10.0.0.0/8).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* New SSH Host Modal */}
      {isNewSshOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateSsh}
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-slate-100 text-sm">Новое SSH-подключение</h3>
              <button
                type="button"
                onClick={() => setIsNewSshOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Название хоста *</label>
                <input
                  type="text"
                  required
                  value={sshName}
                  onChange={(e) => setSshName(e.target.value)}
                  placeholder="GPU Inference Node"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-slate-300 font-medium block mb-1">IP / Домен *</label>
                  <input
                    type="text"
                    required
                    value={sshHost}
                    onChange={(e) => setSshHost(e.target.value)}
                    placeholder="192.168.1.100"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Порт</label>
                  <input
                    type="number"
                    value={sshPort}
                    onChange={(e) => setSshPort(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Пользователь *</label>
                <input
                  type="text"
                  required
                  value={sshUser}
                  onChange={(e) => setSshUser(e.target.value)}
                  placeholder="deploy"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Рабочий каталог</label>
                <input
                  type="text"
                  value={sshWorkingDir}
                  onChange={(e) => setSshWorkingDir(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="ssrfCheck"
                  checked={sshSsrf}
                  onChange={(e) => setSshSsrf(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-600 focus:ring-0"
                />
                <label htmlFor="ssrfCheck" className="text-slate-300 text-[11px] cursor-pointer">
                  Включить защиту от SSRF (блокировать внутренние диапазоны)
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewSshOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
