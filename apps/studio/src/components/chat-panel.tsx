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

export const ChatPanel: React.FC<ChatPanelProps> = ({
  chatMessages,
  chatInput,
  isSendingMessage,
  chatMessagesRef,
  onChatInputChange,
  onSendChatMessage
}) => {
  return (
    <div className="flex-1 min-w-0 flex flex-col h-full bg-[#0a0a0a] relative z-0">
      <div ref={chatMessagesRef as React.RefObject<HTMLDivElement>} className="flex-1 overflow-y-auto px-6 pt-12 relative z-10 scroll-smooth">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-zinc-400" />
            </div>
            <h2 className="text-xl font-medium text-zinc-300 tracking-tight">How can I help you today?</h2>
          </div>
        ) : (
          <div className="max-w-[48rem] mx-auto space-y-12 pb-10">
            {chatMessages.map((entry) => {
              const isUser = entry.role === 'user';
              const isError = entry.role === 'error';

              return (
                <div key={entry.id} className={`group animate-in fade-in slide-in-from-bottom-2 duration-300 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isUser
                        ? 'bg-zinc-100 text-zinc-900'
                        : isError
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-zinc-800 text-zinc-300'
                        }`}>
                        {isError ? '!' : isUser ? 'U' : 'A'}
                      </div>
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        {isUser ? 'You' : isError ? 'Error' : 'Melony'}
                      </span>
                    </div>

                    <div className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap break-words ${isUser
                      ? 'bg-zinc-100 text-zinc-950'
                      : isError
                        ? 'bg-red-500/10 border border-red-400/30 text-red-300'
                        : 'bg-zinc-900 text-zinc-300 border border-zinc-800/80'
                      }`}>
                      {entry.content ||
                        (isSendingMessage && entry.role === 'assistant' ? (
                          <span className="flex gap-1 items-center h-5">
                            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-duration:0.6s]" />
                            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
                          </span>
                        ) : (
                          ''
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 px-6 pb-6 pt-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent">
        <div className="max-w-[48rem] mx-auto relative group">
          <textarea
            value={chatInput}
            onChange={(event) => onChatInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void onSendChatMessage();
              }
            }}
            placeholder="Message Melony..."
            rows={1}
            className="w-full bg-zinc-900/60 border border-zinc-800/60 rounded-2xl pl-6 pr-16 py-4 text-[15px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700/70 focus:bg-zinc-900 transition-all resize-none shadow-2xl backdrop-blur-sm"
            style={{ minHeight: '58px', maxHeight: '200px' }}
          />
          <button
            onClick={() => void onSendChatMessage()}
            disabled={isSendingMessage || !chatInput.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-zinc-100 text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg"
          >
            {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
