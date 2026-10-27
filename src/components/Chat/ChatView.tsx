import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Trash2,
  Cpu,
  Bot,
  FolderGit2,
  Terminal,
  Play,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Code2,
  Shield,
  Layers,
} from 'lucide-react';
import { ChatMessage, Project, Agent, Model } from '../../types';

interface ChatViewProps {
  messages: ChatMessage[];
  activeProject: Project | null;
  activeAgent: Agent | null;
  activeModel: Model | null;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  onUnlinkProjectFromChat: (projectId: string) => void;
  allAgents: Agent[];
  allModels: Model[];
  allProjects: Project[];
  onSelectAgent: (agent: Agent) => void;
  onSelectProject: (project: Project) => void;
  isGenerating: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  activeProject,
  activeAgent,
  activeModel,
  onSendMessage,
  onClearHistory,
  onUnlinkProjectFromChat,
  allAgents,
  allModels,
  allProjects,
  onSelectAgent,
  onSelectProject,
  isGenerating,
}) => {
  const [inputText, setInputText] = useState('');
  const [quickActionOutput, setQuickActionOutput] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSimulateCommand = (cmd: string) => {
    if (!activeProject) return;
    const prefix = `cd "${activeProject.workingDir}" && ${cmd}`;
    setQuickActionOutput(
      `Выполняется в среде [${activeProject.environment.toUpperCase()}]:\n$ ${prefix}\n\n[stdout]:\n> Command executed successfully within working_dir.`
    );
    setTimeout(() => {
      setQuickActionOutput(null);
    }, 4000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Chat Topbar: Context Bar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Agent Picker */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Агент:</span>
            <select
              value={activeAgent?.id || ''}
              onChange={(e) => {
                const found = allAgents.find((a) => a.id === e.target.value);
                if (found) onSelectAgent(found);
              }}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {allAgents.map((a) => (
                <option key={a.id} value={a.id} className="bg-slate-900 text-slate-200">
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project Picker & Environment */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Проект:</span>
            <select
              value={activeProject?.id || ''}
              onChange={(e) => {
                const found = allProjects.find((p) => p.id === e.target.value);
                if (found) onSelectProject(found);
              }}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              {allProjects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.title}
                </option>
              ))}
            </select>

            {activeProject && (
              <span className="font-mono text-[10px] text-cyan-400 uppercase bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                {activeProject.environment}
              </span>
            )}
          </div>
        </div>

        {/* Right actions: Unlink project from chat vs clear chat */}
        <div className="flex items-center gap-2">
          {activeProject && (
            <button
              onClick={() => onUnlinkProjectFromChat(activeProject.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              title="Отвязать проект от текущего чата (проект не удаляется с сервера)"
            >
              <span>Убрать из чата</span>
            </button>
          )}

          <button
            onClick={onClearHistory}
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
            title="Очистить историю диалога"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Working Directory Context strip */}
      {activeProject && (
        <div className="px-4 py-1.5 bg-slate-950/80 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Terminal className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="font-mono text-slate-300 truncate">
              {activeProject.workingDir}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSimulateCommand('git status')}
              className="hover:text-cyan-400 font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
            >
              $ git status
            </button>
            <button
              onClick={() => handleSimulateCommand('pytest tests/')}
              className="hover:text-cyan-400 font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
            >
              $ pytest tests/
            </button>
          </div>
        </div>
      )}

      {/* Quick command output popup if ran */}
      {quickActionOutput && (
        <div className="bg-slate-950 border-b border-cyan-800/40 p-3 text-xs font-mono text-cyan-300 whitespace-pre-wrap shrink-0">
          {quickActionOutput}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSystem = msg.role === 'system';
          const agent = allAgents.find((a) => a.id === msg.agentId);

          if (isSystem) {
            return (
              <div
                key={msg.id}
                className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs text-slate-400 flex items-start gap-2 max-w-2xl mx-auto"
              >
                <Layers className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{msg.content}</span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Sender label and time */}
              <div className="text-[10px] text-slate-500 mb-1 px-1 flex items-center gap-1.5">
                {!isUser && agent && (
                  <span
                    className="font-medium text-xs"
                    style={{ color: agent.avatarColor }}
                  >
                    {agent.name}
                  </span>
                )}
                {isUser && <span className="font-medium text-slate-300">Пользователь</span>}
                <span>·</span>
                <span>{msg.createdAt}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.content}

                {/* Tool calls card if present */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-semibold">
                      Вызовы инструментов агента:
                    </span>
                    {msg.toolCalls.map((tc, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-[11px] font-mono space-y-1"
                      >
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-cyan-300">{tc.tool}</span>
                          <span className="text-emerald-400 text-[10px]">{tc.status}</span>
                        </div>
                        <div className="text-slate-300 bg-slate-950 p-1 rounded overflow-x-auto">
                          $ {tc.input}
                        </div>
                        <div className="text-slate-400 text-[10px] pt-1 leading-snug">
                          {tc.output}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2 bg-slate-950/60 rounded-lg w-fit border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Агент выполняет обработку и генерацию ответа...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Задайте задачу для ${activeAgent?.name || 'агента'} в контексте ${activeProject?.title || 'проекта'}...`}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isGenerating}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Отправить</span>
        </button>
      </form>
    </div>
  );
};
