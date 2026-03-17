import React from 'react';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { ChatMessage } from '../types/studio';

interface ChatPanelProps {
  chatSessionId: string;
  chatMessages: ChatMessage[];
  chatInput: string;
  isSendingMessage: boolean;
  chatMessagesRef: React.RefObject<HTMLDivElement | null>;
  onChatInputChange: (value: string) => void;
  onSendChatMessage: () => Promise<void>;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  chatSessionId,
  chatMessages,
  chatInput,
  isSendingMessage,
  chatMessagesRef,
  onChatInputChange,
  onSendChatMessage
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 relative z-0">
      <div className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center px-6 justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Chat</div>
          <div className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
            {chatSessionId.slice(0, 8)}
          </div>
        </div>
      </div>

      <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scroll-smooth">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
            <div className="w-12 h-12 rounded-xl border border-zinc-800 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-zinc-600" />
            </div>
            <h2 className="text-lg font-medium text-zinc-400">Melony Studio</h2>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            {chatMessages.map((entry) => (
              <div key={entry.id} className={`flex gap-4 ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-0 py-0 text-[14px] leading-relaxed max-w-[90%] ${
                    entry.role === 'user'
                      ? 'text-zinc-100'
                      : entry.role === 'error'
                        ? 'text-red-400'
                        : 'text-zinc-300'
                  }`}
                >
                  <div className={`flex items-center gap-2 mb-2 ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">{entry.role}</span>
                  </div>
                  <div className="whitespace-pre-wrap break-words">
                    {entry.content ||
                      (isSendingMessage && entry.role === 'assistant' ? (
                        <span className="flex gap-1 items-center h-5">
                          <span className="w-1 h-1 bg-zinc-600 rounded-full animate-pulse" />
                          <span className="w-1 h-1 bg-zinc-600 rounded-full animate-pulse [animation-delay:0.2s]" />
                          <span className="w-1 h-1 bg-zinc-600 rounded-full animate-pulse [animation-delay:0.4s]" />
                        </span>
                      ) : (
                        ''
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 pt-2 relative z-10">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            value={chatInput}
            onChange={(event) => onChatInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void onSendChatMessage();
              }
            }}
            placeholder="Message..."
            rows={1}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-5 pr-14 py-4 text-[14px] text-zinc-200 focus:outline-none focus:border-zinc-700 transition-all resize-none shadow-sm"
            style={{ minHeight: '56px', maxHeight: '200px' }}
          />
          <button
            onClick={() => void onSendChatMessage()}
            disabled={isSendingMessage || !chatInput.trim()}
            className="absolute right-3 bottom-3 p-2 rounded-md bg-zinc-100 text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all flex items-center justify-center hover:bg-zinc-200"
          >
            {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
