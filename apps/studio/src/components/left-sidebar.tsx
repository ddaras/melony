import React from 'react';
import { MessageSquare, Trash2, Plus, Layout } from 'lucide-react';
import { Run, RunGroup } from '../types/studio';
import { formatSessionLabel } from '../utils/runs';

interface LeftSidebarProps {
  groupedRuns: RunGroup[];
  chatSessionId: string;
  onClearRuns: () => Promise<void>;
  onStartNewSession: () => void;
  onSelectSession: (sessionId: string, runs: Run[]) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  groupedRuns,
  chatSessionId,
  onClearRuns,
  onStartNewSession,
  onSelectSession
}) => {
  return (
    <div className="w-64 flex flex-col h-full bg-[#0a0a0a] border-r border-zinc-900/50 z-10 transition-all duration-300">
      <div className="p-4 flex items-center justify-between group">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center">
            <Layout className="w-3.5 h-3.5 text-zinc-900" />
          </div>
          <span className="font-semibold text-[13px] tracking-tight text-zinc-200">Melony</span>
        </div>
        <button
          onClick={() => void onClearRuns()}
          className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
          title="Clear History"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="px-3 mb-4">
        <button
          onClick={onStartNewSession}
          className="w-full flex items-center justify-between py-2 px-3 bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800/50 text-zinc-300 rounded-xl text-xs font-medium transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <span>New Chat</span>
          </div>
          <Plus className="w-3 h-3 text-zinc-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-0.5 custom-scrollbar">
        {groupedRuns.length === 0 ? (
          <div className="py-20 px-4 flex flex-col items-center text-center">
            <p className="text-[11px] text-zinc-600 font-medium">No recent chats</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Recent
            </div>
            {groupedRuns.map((group) => (
              <div
                key={group.sessionId}
                className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  chatSessionId === group.sessionId
                    ? 'bg-zinc-900 text-zinc-100 border border-zinc-800/50'
                    : 'text-zinc-500 hover:bg-zinc-900/30 hover:text-zinc-300 border border-transparent'
                }`}
                onClick={() => onSelectSession(group.sessionId, group.runs)}
              >
                <MessageSquare className={`w-3.5 h-3.5 ${chatSessionId === group.sessionId ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <span className="text-xs truncate font-medium flex-1">
                  {formatSessionLabel(group.sessionId)}
                </span>
                {chatSessionId === group.sessionId && (
                  <div className="w-1 h-1 rounded-full bg-zinc-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 mt-auto">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-zinc-900/30 rounded-xl border border-zinc-800/30">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-medium text-zinc-500 tracking-wide uppercase">System Online</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
