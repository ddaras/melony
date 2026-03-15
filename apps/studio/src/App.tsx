import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { 
  Loader2,
  MessageSquare,
  Send,
  Trash2, 
  Terminal,
  ChevronRight,
  Zap,
  Activity,
  Box,
  Cpu,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { JsonView, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

interface MelonyEvent {
  sequence?: number;
  timestamp: number;
  event: {
    type: string;
    data: any;
  };
  state: any;
  type: 'intercept' | 'emit';
}

const compareRunEvents = (a: MelonyEvent, b: MelonyEvent): number => {
  const aSeq = typeof a.sequence === 'number' ? a.sequence : Number.MAX_SAFE_INTEGER;
  const bSeq = typeof b.sequence === 'number' ? b.sequence : Number.MAX_SAFE_INTEGER;
  if (aSeq !== bSeq) {
    return aSeq - bSeq;
  }
  return a.timestamp - b.timestamp;
};

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
    return 'Default Session';
  }
  return `Session ${sessionId.slice(0, 8)}`;
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

const getTraceTone = (eventType: string): { dot: string; bar: string } => {
  const normalized = eventType.toLowerCase();
  if (normalized.includes('error')) {
    return { dot: 'bg-rose-400', bar: 'bg-rose-400/45' };
  }
  if (normalized.includes('llm')) {
    return { dot: 'bg-violet-400', bar: 'bg-violet-400/40' };
  }
  if (normalized.includes('action')) {
    return { dot: 'bg-amber-300', bar: 'bg-amber-300/40' };
  }
  return { dot: 'bg-emerald-400', bar: 'bg-emerald-400/40' };
};

const App: React.FC = () => {
  const [runs, setRuns] = useState<Map<string, Run>>(new Map());
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);
  
  // Chat state
  const [chatEndpoint, setChatEndpoint] = useState('http://localhost:3000/chat/sequential');
  const [chatSessionId, setChatSessionId] = useState(() => createId());
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);

  const [showIntercepts, setShowIntercepts] = useState(false);

  // Inspector layout state
  const [inspectorTab, setInspectorTab] = useState<'payload' | 'state'>('payload');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:7777');
    
    ws.onmessage = (message) => {
      const { type, data } = JSON.parse(message.data);
      
      if (type === 'init') {
        const newRuns = new Map();
        data.forEach((run: Run) => {
          newRuns.set(run.runId, {
            ...run,
            events: [...(run.events || [])].sort(compareRunEvents),
            sessionId: run.sessionId || run.state?.sessionId || 'default'
          });
        });
        setRuns(newRuns);
      } else if (type === 'event') {
        setRuns((prev) => {
          const newRuns = new Map(prev);
          const { runId, sessionId, agentName, sequence, timestamp, event, state, type: eventType } = data;
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
          run.events.push({ sequence, timestamp, event, state, type: eventType });
          run.events.sort(compareRunEvents);
          run.lastUpdatedAt = Math.max(run.lastUpdatedAt || timestamp, timestamp);
          if (state) {
            run.state = state;
          }
          
          // Auto-select latest run if it matches our active chat session
          if (resolvedSessionId === chatSessionId && !selectedRunId) {
            setSelectedRunId(runId);
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
  }, [chatSessionId, selectedRunId]);

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
  const selectedRunDurationMs = useMemo(() => {
    if (!selectedRun || selectedRun.events.length === 0) {
      return 0;
    }
    const firstTimestamp = selectedRun.startedAt || selectedRun.events[0].timestamp;
    const lastTimestamp = Math.max(
      selectedRun.lastUpdatedAt,
      selectedRun.events[selectedRun.events.length - 1].timestamp
    );
    return Math.max(0, lastTimestamp - firstTimestamp);
  }, [selectedRun]);

  const timelineRows = useMemo(() => {
    if (!selectedRun || selectedRun.events.length === 0) {
      return [];
    }

    const runStart = selectedRun.startedAt || selectedRun.events[0].timestamp;
    const runEnd = Math.max(
      selectedRun.lastUpdatedAt,
      selectedRun.events[selectedRun.events.length - 1].timestamp + 1
    );
    const totalDuration = Math.max(1, runEnd - runStart);

    return selectedRun.events
      .map((event, idx) => {
        const nextEvent = selectedRun.events[idx + 1];
        const startMs = Math.max(0, event.timestamp - runStart);
        const rawDurationMs = nextEvent
          ? Math.max(1, nextEvent.timestamp - event.timestamp)
          : Math.max(1, runEnd - event.timestamp);

        const leftPercent = Math.min(100, (startMs / totalDuration) * 100);
        const requestedWidth = Math.max(0.9, (rawDurationMs / totalDuration) * 100);
        const widthPercent = Math.max(0.9, Math.min(100 - leftPercent, requestedWidth));
        const tone = getTraceTone(event.event.type);

        return {
          event,
          idx,
          startMs,
          durationMs: rawDurationMs,
          leftPercent,
          widthPercent,
          tone
        };
      })
      .filter((row) => showIntercepts || row.event.type !== 'intercept');
  }, [selectedRun, showIntercepts]);

  // Restore chat messages from run state when a run is selected
  useEffect(() => {
    if (!selectedRun) return;

    // Only update chat session if it's different, to avoid resetting input unnecessarily
    if (selectedRun.sessionId && selectedRun.sessionId !== chatSessionId) {
      setChatSessionId(selectedRun.sessionId);
      
      const latestState = selectedRun.events[selectedRun.events.length - 1]?.state || selectedRun.state;
      if (latestState?.messages) {
        setChatMessages(normalizeRuntimeMessages(latestState.messages));
      }
    }
  }, [selectedRun, chatSessionId]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, isSendingMessage]);

  const clearRuns = async () => {
    await fetch('http://localhost:7777/api/runs', { method: 'DELETE' });
  };

  const startNewSession = () => {
    setChatSessionId(createId());
    setChatMessages([]);
    setChatInput('');
    setSelectedRunId(null);
    setSelectedEventIndex(null);
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
        if (!line.startsWith('data:')) continue;
        
        const payload = line.slice(5).trim();
        if (!payload) continue;
        
        try {
          const parsedEvent = JSON.parse(payload);
          if (parsedEvent?.type === 'error') {
            const errorMessage = extractEventText(parsedEvent) || 'The chat endpoint returned an error.';
            updateAssistantMessage(errorMessage, 'error');
            continue;
          }
          const eventText = extractEventText(parsedEvent);
          if (!eventText) continue;
          
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId: chatSessionId })
      });

      if (!response.ok) throw new Error(`Chat request failed with status ${response.status}`);
      if (!response.body) throw new Error('Chat response body is empty.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
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
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-300 overflow-hidden font-sans selection:bg-zinc-500/30">
      <Analytics />
      
      {/* 1. LEFT PANEL: Session & Run Management */}
      <div className="w-72 border-r border-zinc-800 flex flex-col h-full bg-zinc-950 shadow-sm z-10">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded border border-zinc-700 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-zinc-300" />
            </div>
            <h1 className="font-semibold text-sm tracking-tight text-zinc-100">Melony Studio</h1>
          </div>
          <button 
            onClick={clearRuns} 
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
            title="Clear all runs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-3 border-b border-zinc-800 flex flex-col gap-2 bg-zinc-950">
          <button
            onClick={startNewSession}
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
                  chatSessionId === group.sessionId ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
                onClick={() => {
                  setChatSessionId(group.sessionId);
                  if (group.runs.length > 0) {
                    setSelectedRunId(group.runs[0].runId);
                    
                    const latestRun = group.runs[0];
                    const latestState = latestRun.events[latestRun.events.length - 1]?.state || latestRun.state;
                    if (latestState?.messages) {
                      setChatMessages(normalizeRuntimeMessages(latestState.messages));
                    }
                  }
                }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatSessionId(run.sessionId);
                      setSelectedRunId(run.runId);
                      setSelectedEventIndex(null);
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
                        {new Date(run.lastUpdatedAt).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-600">
                      <span className="font-mono opacity-50 text-[9px]">
                        {run.runId.slice(0, 8)}
                      </span>
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
          <div className="flex flex-col gap-1 w-32">
             <input
              value={chatEndpoint}
              onChange={(event) => setChatEndpoint(event.target.value)}
              title="Chat API Endpoint"
              className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[9px] text-zinc-500 focus:outline-none focus:border-zinc-700 w-full"
            />
          </div>
        </div>
      </div>

      {/* 2. CENTRAL PANEL: Chat Interface */}
      <div className="flex-1 flex flex-col h-full bg-zinc-950 relative z-0">
        
        {/* Chat Header */}
        <div className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center px-6 justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Chat</div>
            <div className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
              {chatSessionId.slice(0,8)}
            </div>
          </div>
        </div>

        {/* Messages */}
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
                <div
                  key={entry.id}
                  className={`flex gap-4 ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
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
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">
                        {entry.role}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap break-words">
                      {entry.content || (isSendingMessage && entry.role === 'assistant' ? (
                        <span className="flex gap-1 items-center h-5">
                          <span className="w-1 h-1 bg-zinc-600 rounded-full animate-pulse"></span>
                          <span className="w-1 h-1 bg-zinc-600 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                          <span className="w-1 h-1 bg-zinc-600 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                        </span>
                      ) : '')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 pt-2 relative z-10">
          <div className="max-w-3xl mx-auto relative">
            <textarea
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void sendChatMessage();
                }
              }}
              placeholder="Message..."
              rows={1}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-5 pr-14 py-4 text-[14px] text-zinc-200 focus:outline-none focus:border-zinc-700 transition-all resize-none shadow-sm"
              style={{ minHeight: '56px', maxHeight: '200px' }}
            />
            <button
              onClick={() => void sendChatMessage()}
              disabled={isSendingMessage || !chatInput.trim()}
              className="absolute right-3 bottom-3 p-2 rounded-md bg-zinc-100 text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all flex items-center justify-center hover:bg-zinc-200"
            >
              {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. RIGHT PANEL: Inspector (Timeline & Details) */}
      <div className="w-[580px] 2xl:w-[820px] border-l border-zinc-800 flex flex-col h-full bg-zinc-950 shadow-sm z-20">
        
        {/* Top Half: Timeline */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-zinc-800">
          <div className="p-3.5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <Activity className="w-4 h-4" />
                <h3 className="font-semibold text-[10px] uppercase tracking-widest">Waterfall</h3>
              </div>
              <button
                onClick={() => setShowIntercepts(!showIntercepts)}
                title={showIntercepts ? "Hide intercepts" : "Show intercepts"}
                className={`p-1 rounded transition-colors ${
                  showIntercepts 
                    ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20' 
                    : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {showIntercepts ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
            {selectedRunId && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-zinc-600 px-2 py-0.5 rounded border border-zinc-800">
                  {selectedRunId.slice(0, 8)}
                </span>
                <span className="text-[9px] font-mono text-zinc-600 px-2 py-0.5 rounded border border-zinc-800">
                  {selectedRunDurationMs}ms
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 bg-zinc-950">
            {!selectedRun ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-700 text-center space-y-3">
                <Terminal className="w-6 h-6 opacity-20" />
                <p className="text-[10px] uppercase tracking-widest opacity-30">Select Run</p>
              </div>
            ) : (
              <div className="space-y-1">
                {timelineRows.map((row) => {
                  return (
                    <button
                      key={row.idx}
                      onClick={() => setSelectedEventIndex(row.idx)}
                      className={`w-full text-left px-3 py-1.5 rounded border transition-all ${
                        selectedEventIndex === row.idx
                          ? 'bg-zinc-900 border-zinc-700'
                          : 'bg-transparent border-transparent hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 w-48 2xl:w-64">
                          <div className="flex items-center gap-2">
                            <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${row.tone.dot}`} />
                            <span className="text-[10px] font-bold text-zinc-300 font-mono truncate uppercase">
                              {row.event.event.type}
                            </span>
                            <span
                              className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider border ${
                                row.event.type === 'intercept'
                                  ? 'text-amber-300 bg-amber-500/10 border-amber-400/30'
                                  : 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30'
                              }`}
                            >
                              {row.event.type}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="h-1 rounded-full bg-zinc-900 relative overflow-hidden">
                            <div
                              className={`absolute top-0 bottom-0 rounded-full ${row.tone.bar}`}
                              style={{
                                left: `${row.leftPercent}%`,
                                width: `${row.widthPercent}%`
                              }}
                            />
                          </div>
                        </div>

                        <div className="w-24 text-[9px] font-mono text-zinc-600 text-right whitespace-nowrap">
                          {row.durationMs}ms
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Half: Details */}
        <div className="h-[340px] flex flex-col min-h-0 bg-zinc-950">
          <div className="flex items-center border-b border-zinc-800 bg-zinc-950 px-2 pt-1">
            <button
              onClick={() => setInspectorTab('payload')}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border-b transition-colors ${
                inspectorTab === 'payload' 
                  ? 'border-zinc-300 text-zinc-200' 
                  : 'border-transparent text-zinc-600 hover:text-zinc-400'
              }`}
            >
              Payload
            </button>
            <button
              onClick={() => setInspectorTab('state')}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border-b transition-colors ${
                inspectorTab === 'state' 
                  ? 'border-zinc-300 text-zinc-200' 
                  : 'border-transparent text-zinc-600 hover:text-zinc-400'
              }`}
            >
              State
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-950">
            {!selectedEvent ? (
              <div className="h-full flex items-center justify-center text-zinc-700 text-[10px] uppercase tracking-widest opacity-30">
                Select Event
              </div>
            ) : (
              <div className="font-mono text-[11px]">
                {inspectorTab === 'payload' ? (
                  <JsonView 
                    data={selectedEvent.event} 
                    style={darkStyles} 
                    shouldExpandNode={() => true}
                  />
                ) : (
                  <JsonView 
                    data={selectedEvent.state} 
                    style={darkStyles} 
                    shouldExpandNode={(level) => level < 2}
                  />
                )}
              </div>
            )}
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default App;
