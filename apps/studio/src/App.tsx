import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Loader2,
  MessageSquare,
  Send,
  Trash2, 
  Clock, 
  Zap, 
  Terminal,
  ChevronRight,
  Info
} from 'lucide-react';
import { JsonView, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

interface MelonyEvent {
  timestamp: number;
  event: {
    type: string;
    data: any;
    id?: string;
  };
  state: any;
  type: 'intercept' | 'emit';
}

interface Run {
  runId: string;
  sessionId: string;
  agentName?: string;
  events: MelonyEvent[];
  startedAt: number;
  lastUpdatedAt: number;
  state: any;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
}

type RuntimeMessage = {
  role?: unknown;
  content?: unknown;
};

const extractEventText = (event: any): string => {
  if (typeof event?.text === 'string') return event.text;
  if (typeof event?.data === 'string') return event.data;
  if (typeof event?.data?.text === 'string') return event.data.text;
  if (typeof event?.message === 'string') return event.message;
  if (typeof event?.data?.message === 'string') return event.data.message;
  return '';
};

const mergeAssistantText = (currentText: string, incomingText: string, eventType?: string): string => {
  const normalizedType = (eventType || '').toLowerCase();
  if (normalizedType.includes('delta')) {
    return `${currentText}${incomingText}`;
  }
  if (normalizedType.includes('done') && incomingText.startsWith(currentText)) {
    return incomingText;
  }
  if (!currentText) {
    return incomingText;
  }
  if (incomingText === currentText) {
    return currentText;
  }
  return `${currentText}\n${incomingText}`;
};

const formatSessionLabel = (sessionId: string): string => {
  if (!sessionId || sessionId === 'default') {
    return 'DEFAULT SESSION';
  }
  return `SESSION ${sessionId.slice(0, 12)}${sessionId.length > 12 ? '...' : ''}`;
};

const createId = (): string => crypto.randomUUID();

const toChatRole = (role: unknown): ChatMessage['role'] => {
  if (role === 'user' || role === 'assistant' || role === 'error') {
    return role;
  }
  return 'assistant';
};

const normalizeRuntimeMessages = (messages: unknown): ChatMessage[] => {
  if (!Array.isArray(messages)) {
    return [];
  }

  return (messages as RuntimeMessage[])
    .filter((entry) => typeof entry?.content === 'string' && entry.content.trim().length > 0)
    .map((entry) => ({
      id: createId(),
      role: toChatRole(entry.role),
      content: entry.content as string
    }));
};

const App: React.FC = () => {
  const [runs, setRuns] = useState<Map<string, Run>>(new Map());
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);
  const [activePanel, setActivePanel] = useState<'inspector' | 'chat'>('inspector');
  const [chatEndpoint, setChatEndpoint] = useState('http://localhost:3000/chat');
  const [chatSessionId, setChatSessionId] = useState(() => createId());
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:7777');
    
    ws.onmessage = (message) => {
      const { type, data } = JSON.parse(message.data);
      
      if (type === 'init') {
        const newRuns = new Map();
        data.forEach((run: Run) => {
          newRuns.set(run.runId, {
            ...run,
            sessionId: run.sessionId || run.state?.sessionId || 'default'
          });
        });
        setRuns(newRuns);
      } else if (type === 'event') {
        setRuns((prev) => {
          const newRuns = new Map(prev);
          const { runId, sessionId, agentName, timestamp, event, state, type: eventType } = data;
          const resolvedSessionId = sessionId || state?.sessionId || 'default';
          
          if (!newRuns.has(runId)) {
            newRuns.set(runId, { 
              runId, 
              sessionId: resolvedSessionId,
              agentName,
              events: [], 
              startedAt: timestamp, 
              lastUpdatedAt: timestamp,
              state: state || {}
            });
          }
          
          const run = newRuns.get(runId)!;
          run.sessionId = run.sessionId || resolvedSessionId;
          if (agentName && (!run.agentName || run.agentName === 'Anonymous Agent')) {
            run.agentName = agentName;
          }
          run.events.push({ timestamp, event, state, type: eventType });
          run.lastUpdatedAt = timestamp;
          if (state) {
            run.state = state;
          }
          
          return newRuns;
        });
      } else if (type === 'clear') {
        setRuns(new Map());
        setSelectedRunId(null);
        setSelectedEventIndex(null);
      }
    };

    return () => ws.close();
  }, []);

  const groupedRuns = useMemo(() => {
    const sessionMap = new Map<string, Run[]>();
    for (const run of runs.values()) {
      const sessionId = run.sessionId || run.state?.sessionId || 'default';
      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, []);
      }
      sessionMap.get(sessionId)!.push(run);
    }

    return Array.from(sessionMap.entries())
      .map(([sessionId, sessionRuns]) => ({
        sessionId,
        runs: sessionRuns.sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt),
        lastUpdatedAt: Math.max(...sessionRuns.map((run) => run.lastUpdatedAt))
      }))
      .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);
  }, [runs]);
  const selectedRun = selectedRunId ? runs.get(selectedRunId) : null;
  const selectedEvent = selectedRun && selectedEventIndex !== null ? selectedRun.events[selectedEventIndex] : null;

  useEffect(() => {
    if (!selectedRun) {
      return;
    }

    const latestState = selectedRun.events[selectedRun.events.length - 1]?.state || selectedRun.state;
    const stateMessages = normalizeRuntimeMessages(latestState?.messages);
    setChatMessages(stateMessages);
    if (selectedRun.sessionId) {
      setChatSessionId(selectedRun.sessionId);
    }
    setChatInput('');
  }, [selectedRun]);

  useEffect(() => {
    chatMessagesRef.current?.scrollTo({ top: chatMessagesRef.current.scrollHeight });
  }, [chatMessages, isSendingMessage]);

  const clearRuns = async () => {
    await fetch('http://localhost:7777/api/runs', { method: 'DELETE' });
  };

  const startNewSession = () => {
    setChatSessionId(createId());
    setChatMessages([]);
    setChatInput('');
  };

  const sendChatMessage = async () => {
    const message = chatInput.trim();
    if (!message || isSendingMessage) {
      return;
    }

    const assistantMessageId = createId();
    setChatMessages((prev) => [
      ...prev,
      { id: createId(), role: 'user', content: message },
      { id: assistantMessageId, role: 'assistant', content: '' }
    ]);
    setChatInput('');
    setIsSendingMessage(true);
    setActivePanel('chat');

    const updateAssistantMessage = (content: string, role: ChatMessage['role'] = 'assistant') => {
      setChatMessages((prev) =>
        prev.map((entry) =>
          entry.id === assistantMessageId ? { ...entry, role, content } : entry
        )
      );
    };

    const processSseChunk = (chunk: string, currentText: string) => {
      let updatedText = currentText;
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (!line.startsWith('data:')) {
          continue;
        }
        const payload = line.slice(5).trim();
        if (!payload) {
          continue;
        }
        try {
          const parsedEvent = JSON.parse(payload);
          if (parsedEvent?.type === 'error') {
            const errorMessage = extractEventText(parsedEvent) || 'The chat endpoint returned an error.';
            updateAssistantMessage(errorMessage, 'error');
            continue;
          }
          const eventText = extractEventText(parsedEvent);
          if (!eventText) {
            continue;
          }
          updatedText = mergeAssistantText(updatedText, eventText, parsedEvent?.type);
          updateAssistantMessage(updatedText || '...');
        } catch {
          // Ignore malformed SSE payload chunks.
        }
      }
      return updatedText;
    };

    try {
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, sessionId: chatSessionId })
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Chat response body is empty.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';
        for (const chunk of chunks) {
          assistantText = processSseChunk(chunk, assistantText);
        }
      }

      if (buffer.trim()) {
        assistantText = processSseChunk(buffer, assistantText);
      }

      if (!assistantText.trim()) {
        updateAssistantMessage('No textual response was returned by the chat endpoint.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send chat message.';
      updateAssistantMessage(errorMessage, 'error');
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar: Run List */}
      <div className="w-80 border-r border-zinc-800 flex flex-col h-full bg-zinc-900/50">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500/10" />
            <h1 className="font-bold text-lg tracking-tight">Melony Studio</h1>
          </div>
          <button onClick={clearRuns} className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-red-400">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {groupedRuns.length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-sm italic">
              No runs captured yet...
            </div>
          )}
          {groupedRuns.map((group) => (
            <section key={group.sessionId} className="mb-3">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center justify-between">
                <span className="truncate">{formatSessionLabel(group.sessionId)}</span>
                <span className="text-zinc-600">{group.runs.length}</span>
              </div>
              <div className="space-y-1">
                {group.runs.map((run) => (
                  <button
                    key={run.runId}
                    onClick={() => {
                      setSelectedRunId(run.runId);
                      setSelectedEventIndex(null);
                      setActivePanel('chat');
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all border border-transparent ${
                      selectedRunId === run.runId 
                        ? 'bg-zinc-800 border-zinc-700 shadow-sm' 
                        : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-medium truncate opacity-60">RUN: {run.runId.slice(0, 8)}...</span>
                      <span className="text-[10px] opacity-40 uppercase tracking-widest">{new Date(run.lastUpdatedAt).toLocaleTimeString([], { hour12: false })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold truncate text-zinc-100">
                      {run.agentName || 'Anonymous Agent'}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 opacity-50 text-[10px]">
                      <Clock className="w-3 h-3" />
                      <span>{run.events.length} events emitted</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Main Content: Timeline */}
      <div className="flex-1 flex flex-col h-full bg-zinc-950">
        {!selectedRun ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40 select-none">
            <div className="p-8 bg-zinc-900 rounded-full mb-6 border border-zinc-800">
               <Zap className="w-16 h-16 text-zinc-600" />
            </div>
            <p className="text-lg font-medium tracking-wide">SELECT A RUN TO BEGIN INSPECTION</p>
            <p className="text-sm mt-2 opacity-60">Ready to trace your agent's stream of thought</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg text-zinc-100 leading-tight">
                    {selectedRun.agentName || 'Anonymous Agent'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] font-mono text-zinc-400 border border-zinc-700">ID: {selectedRunId}</span>
                    <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] font-mono text-zinc-400 border border-zinc-700">SESSION: {selectedRun.sessionId}</span>
                    <span className="text-xs text-zinc-500 ml-1">Started {new Date(selectedRun.startedAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                   {/* Add any toolbar buttons here */}
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="max-w-4xl mx-auto space-y-3">
                {selectedRun.events.map((e, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedEventIndex(idx)}
                    className={`group w-full flex items-start text-left gap-4 p-3 rounded-lg border transition-all ${
                      selectedEventIndex === idx 
                        ? 'bg-zinc-800 border-zinc-600 shadow-lg translate-x-1' 
                        : 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full ring-4 ring-zinc-950 ${
                        e.event.type.includes('error') ? 'bg-red-500' :
                        e.event.type.includes('llm') ? 'bg-blue-400' :
                        e.event.type.includes('action') ? 'bg-purple-400' :
                        'bg-emerald-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">{new Date(e.timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 })}</span>
                        <span className={`text-[10px] px-1 rounded font-mono ${e.type === 'intercept' ? 'bg-amber-900/30 text-amber-500 border border-amber-900/50' : 'bg-zinc-800 text-zinc-500'}`}>
                          {e.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="font-mono text-sm font-bold tracking-tight text-zinc-200 truncate group-hover:text-white transition-colors">
                        {e.event.type}
                      </div>
                      {typeof e.event.data === 'string' && (
                        <div className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed opacity-80 italic">
                          "{e.event.data}"
                        </div>
                      )}
                      {e.event.type === 'llm:text:delta' && (
                        <div className="text-xs text-zinc-400 mt-1.5 font-mono line-clamp-1 opacity-60">
                          {typeof e.event.data === 'string'
                            ? e.event.data
                            : typeof e.event.data?.text === 'string'
                              ? e.event.data.text
                              : JSON.stringify(e.event.data)}
                        </div>
                      )}
                    </div>
                    <ChevronRight className={`w-4 h-4 mt-1 transition-transform opacity-0 group-hover:opacity-100 ${selectedEventIndex === idx ? 'opacity-100 rotate-90' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Panel: Event/State Details + Chat */}
      <div className="w-[450px] border-l border-zinc-800 flex flex-col h-full bg-zinc-900/20 backdrop-blur-xl">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 p-1">
            <button
              onClick={() => setActivePanel('inspector')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                activePanel === 'inspector'
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                Inspector
              </span>
            </button>
            <button
              onClick={() => setActivePanel('chat')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                activePanel === 'chat'
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Chat
              </span>
            </button>
          </div>
          {activePanel === 'chat' && (
            <button
              onClick={() => setChatMessages([])}
              className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Clear chat
            </button>
          )}
        </div>

        {activePanel === 'inspector' && !selectedEvent && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-600 opacity-60">
            <Terminal className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-xs uppercase tracking-widest font-bold">Select an event to view payload and state</p>
          </div>
        )}

        {activePanel === 'inspector' && selectedEvent && (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-800/50 pb-1.5">Event Data</h4>
              <div className="bg-zinc-900/80 rounded-lg p-4 border border-zinc-800 shadow-inner overflow-hidden">
                <JsonView 
                  data={selectedEvent.event} 
                  style={darkStyles} 
                  shouldExpandNode={() => true}
                />
              </div>
            </section>
            
            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-800/50 pb-1.5">Context State Snapshot</h4>
              <div className="bg-zinc-900/80 rounded-lg p-4 border border-zinc-800 shadow-inner overflow-hidden">
                <JsonView 
                  data={selectedEvent.state} 
                  style={darkStyles} 
                  shouldExpandNode={(level) => level < 2}
                />
              </div>
            </section>
          </div>
        )}

        {activePanel === 'chat' && (
          <>
            <div className="p-3 border-b border-zinc-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold block">
                  Express Chat Endpoint
                </label>
                <button
                  onClick={startNewSession}
                  className="text-[10px] uppercase tracking-widest text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded px-2 py-1 transition-colors"
                >
                  New Session
                </button>
              </div>
              <input
                value={chatEndpoint}
                onChange={(event) => setChatEndpoint(event.target.value)}
                placeholder="http://localhost:3000/chat"
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <div className="text-[10px] font-mono text-zinc-500 truncate">
                SESSION ID: {chatSessionId}
              </div>
            </div>

            <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-xs text-zinc-500 text-center pt-8">
                  Send a message to test your Express app chat endpoint.
                </div>
              )}
              {chatMessages.map((entry) => (
                <div
                  key={entry.id}
                  className={`rounded-lg p-2.5 text-sm leading-relaxed border ${
                    entry.role === 'user'
                      ? 'bg-zinc-800 border-zinc-700 ml-6'
                      : entry.role === 'error'
                        ? 'bg-red-950/40 border-red-900/60 text-red-200 mr-6'
                        : 'bg-zinc-900 border-zinc-800 mr-6'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-widest mb-1 opacity-60">
                    {entry.role}
                  </div>
                  <div className="whitespace-pre-wrap break-words">{entry.content || '...'}</div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-zinc-800">
              <div className="flex items-end gap-2">
                <textarea
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void sendChatMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={2}
                  className="flex-1 resize-none bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
                <button
                  onClick={() => void sendChatMessage()}
                  disabled={isSendingMessage || !chatInput.trim()}
                  className="h-10 w-10 rounded bg-zinc-100 text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-opacity"
                  title="Send message"
                >
                  {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
