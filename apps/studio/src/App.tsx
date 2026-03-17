import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useMelony } from '@melony/react';
import 'react-json-view-lite/dist/index.css';
import ChatPanel from './components/chat-panel';
import InspectorPanel from './components/inspector-panel';
import LeftSidebar from './components/left-sidebar';
import { InspectorTab } from './types/studio';
import { createId, extractEventText } from './utils/chat';

const App: React.FC = () => {
  const { send, messages: melonyMessages, events, context, streaming: isSendingMessage, reset } = useMelony();
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);

  // Chat state
  const [chatSessionId, setChatSessionId] = useState(() => createId());
  const [chatInput, setChatInput] = useState('');
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const [showIntercepts, setShowIntercepts] = useState(false);

  // Inspector layout state
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('payload');

  const groupedRuns = useMemo(() => [], []);
  const filteredEvents = useMemo(() => {
    if (showIntercepts) {
      return events;
    }
    return events.filter((event) => !event.type.toLowerCase().includes('intercept'));
  }, [events, showIntercepts]);

  const selectedEvent =
    selectedEventIndex === null
      ? null
      : filteredEvents[selectedEventIndex] ?? null;
  const selectedRunId = useMemo(() => {
    for (let index = melonyMessages.length - 1; index >= 0; index -= 1) {
      const runId = melonyMessages[index]?.runId;
      if (typeof runId === 'string' && runId.length > 0) {
        return runId;
      }
    }
    return null;
  }, [melonyMessages]);

  useEffect(() => {
    if (filteredEvents.length === 0) {
      setSelectedEventIndex(null);
      return;
    }
    setSelectedEventIndex((current) => {
      if (current === null || current >= filteredEvents.length) {
        return filteredEvents.length - 1;
      }
      return current;
    });
  }, [filteredEvents.length]);

  // Render chat directly from useMelony messages
  const displayMessages = useMemo(() => {
    return melonyMessages.map(msg => ({
      id: msg.runId || createId(),
      role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant' | 'error',
      content: msg.content.map(e => extractEventText(e)).join('')
    }));
  }, [melonyMessages]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [displayMessages, isSendingMessage]);

  const clearRuns = async () => {
    reset();
    setSelectedEventIndex(null);
  };

  const startNewSession = () => {
    const newId = createId();
    setChatSessionId(newId);
    setChatInput('');
    setSelectedEventIndex(null);
    reset();
  };

  const sendChatMessage = async () => {
    const message = chatInput.trim();
    if (!message || isSendingMessage) {
      return;
    }

    setChatInput('');

    try {
      await send({
        type: 'user:intent',
        data: { text: message }
      }, {
        sessionId: chatSessionId
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    setChatSessionId(sessionId);
    reset();
    setSelectedEventIndex(null);
  };

  const handleSelectRun = () => {
    setSelectedEventIndex(null);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-300 overflow-hidden font-sans selection:bg-zinc-500/30">
      <Analytics />

      <LeftSidebar
        groupedRuns={groupedRuns}
        chatSessionId={chatSessionId}
        selectedRunId={selectedRunId}
        onClearRuns={clearRuns}
        onStartNewSession={startNewSession}
        onSelectSession={handleSelectSession}
        onSelectRun={handleSelectRun}
      />

      <ChatPanel
        chatSessionId={chatSessionId}
        chatMessages={displayMessages}
        chatInput={chatInput}
        isSendingMessage={isSendingMessage}
        chatMessagesRef={chatMessagesRef}
        onChatInputChange={setChatInput}
        onSendChatMessage={sendChatMessage}
      />

      <InspectorPanel
        events={filteredEvents}
        context={context}
        selectedRunId={selectedRunId}
        selectedEvent={selectedEvent}
        selectedEventIndex={selectedEventIndex}
        showIntercepts={showIntercepts}
        inspectorTab={inspectorTab}
        onShowInterceptsToggle={() => setShowIntercepts((prev) => !prev)}
        onSelectEventIndex={setSelectedEventIndex}
        onInspectorTabChange={setInspectorTab}
      />
    </div>
  );
};

export default App;
