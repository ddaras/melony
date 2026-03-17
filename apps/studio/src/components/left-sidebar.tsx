import React from 'react';
import { Activity, Cpu, Layers, MessageSquare, Trash2 } from 'lucide-react';
import { ChatMessage, Run, RunGroup } from '../types/studio';
import { formatSessionLabel } from '../utils/runs';

interface LeftSidebarProps {
  groupedRuns: RunGroup[];
  chatSessionId: string;
  selectedRunId: string | null;
  onClearRuns: () => Promise<void>;
  onStartNewSession: () => void;
  onSelectSession: (sessionId: string, runs: Run[]) => void;
  onSelectRun: (run: Run) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  groupedRuns,
  chatSessionId,
  selectedRunId,
  onClearRuns,
  onStartNewSession,
  onSelectSession,
  onSelectRun
}) => {
  return (
    <div className="w-72 border-r border-zinc-800 flex flex-col h-full bg-zinc-950 shadow-sm z-10">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded border border-zinc-700 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-zinc-300" />
          </div>
          <h1 className="font-semibold text-sm tracking-tight text-zinc-100">Melony Studio</h1>
        </div>
        <button
          onClick={() => void onClearRuns()}
          className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
          title="Clear all runs"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 border-b border-zinc-800 flex flex-col gap-2 bg-zinc-950">
        <button
          onClick={onStartNewSession}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md text-xs font-medium transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          New Session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {groupedRuns.length === 0 && (
          <div className="py-12 px-4 flex flex-col items-center text-center text-zinc-600">
            <Layers className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-xs font-medium">No sessions.</p>
          </div>
        )}

        {groupedRuns.map((group) => (
          <div key={group.sessionId} className="space-y-1.5">
            <div
              className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer ${
                chatSessionId === group.sessionId
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
              }`}
              onClick={() => onSelectSession(group.sessionId, group.runs)}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {formatSessionLabel(group.sessionId)}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-sky-500/30 text-sky-300 bg-sky-500/10">
                {group.runs.length}
              </span>
            </div>

            <div className="pl-2 space-y-1 border-l border-zinc-800 ml-2">
              {group.runs.map((run) => (
                <button
                  key={run.runId}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectRun(run);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-all ${
                    selectedRunId === run.runId
                      ? 'bg-zinc-900 border border-zinc-800 shadow-sm'
                      : 'border border-transparent hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium truncate ${selectedRunId === run.runId ? 'text-zinc-100' : ''}`}>
                      {run.agentName || 'Agent'}
                    </span>
                    <span className="text-[9px] text-zinc-600">
                      {new Date(run.lastUpdatedAt).toLocaleTimeString([], {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-600">
                    <span className="font-mono opacity-50 text-[9px]">{run.runId.slice(0, 8)}</span>
                    <span className="flex items-center gap-1 opacity-50">
                      <Activity className="w-3 h-3" />
                      {run.events.length}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-[10px] font-mono text-zinc-600">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Connected
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
