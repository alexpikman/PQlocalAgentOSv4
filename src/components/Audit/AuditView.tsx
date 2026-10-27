import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AuditReportData } from '../../types';

export const AuditView: React.FC = () => {
  const [report, setReport] = useState<AuditReportData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  const fetchAuditReport = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/audit/run');
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (e) {
      console.warn('Failed to fetch audit report:', e);
    } finally {
      setIsRunning(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/log');
      if (res.ok) {
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchAuditReport();
    fetchEvents();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>Модуль самодиагностики ядра: audit_checks.py</span>
            <span>·</span>
            <span className="text-emerald-400">11 проверок целостности</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Аудит системы и Журнал событий</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Автоматическая верификация схемы данных, прав агентов, осиротевших задач и утечек токенов
          </p>
        </div>

        <button
          onClick={fetchAuditReport}
          disabled={isRunning}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Проверка...' : 'Запустить полный аудит'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      {report && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-xs">Всего проверок</div>
            <div className="text-xl font-mono font-bold text-slate-100 mt-1">
              {report.summary.total}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">{report.duration_ms} мс</div>
          </div>

          <div className="bg-slate-900 border border-emerald-800/40 rounded-xl p-4">
            <div className="text-emerald-400 text-xs">Успешно пройдено</div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
              {report.summary.pass}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">100% стабильно</div>
          </div>

          <div className="bg-slate-900 border border-rose-800/40 rounded-xl p-4">
            <div className="text-rose-400 text-xs">Ошибки целостности</div>
            <div className="text-xl font-mono font-bold text-rose-400 mt-1">
              {report.summary.errors}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              {report.summary.errors === 0 ? 'Дефекты отсутствуют' : 'Требует внимания'}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-slate-400 text-xs">Пропущено (skip)</div>
            <div className="text-xl font-mono font-bold text-slate-300 mt-1">
              {report.summary.skip}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">Условные проверки</div>
          </div>
        </div>
      )}

      {/* Audit Checks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Результаты проверок ядра
          </h3>
          <span className="text-[10px] font-mono text-slate-500">
            {report?.generated_at ? new Date(report.generated_at).toLocaleString() : ''}
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {report?.checks.map((check) => {
            const isPass = check.status === 'pass';
            const isFail = check.status === 'fail';

            return (
              <div key={check.id} className="py-3 flex items-start gap-3 text-xs">
                {isPass ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : isFail ? (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{check.category}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isPass
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                          : isFail
                          ? 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {check.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed">{check.message}</p>

                  <div className="text-[10px] font-mono text-slate-600">ID: {check.id}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
