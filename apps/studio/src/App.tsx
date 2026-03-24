import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ChatPanel } from './components/chat-panel';
import { LeftSidebar } from './components/left-sidebar';
import { generateId } from 'melony';
import { useStudioMelony } from './hooks/use-studio-melony';

const toDisplayRole = (role: string): 'user' | 'assistant' | 'error' => {
  if (role === 'user' || role === 'assistant' || role === 'error') {
    return role;
  }

  return 'assistant';
};

const TEXT_DELTA_TYPES = new Set([
  'llm:text:delta',
  'assistant:text:delta',
  'assistant:text-delta',
]);

const FULL_ASSISTANT_TEXT_TYPES = new Set(['llm:text', 'assistant:text']);

function displayTextFromAssistantEvents(events: any[]): string {
  let fromDeltas = '';
  for (const e of events) {
    if (TEXT_DELTA_TYPES.has(e.type)) {
      const d = e.data as { text?: string; delta?: string } | undefined;
      fromDeltas += d?.text ?? d?.delta ?? '';
    }
  }
  if (fromDeltas) return fromDeltas;

  for (const e of events) {
    if (FULL_ASSISTANT_TEXT_TYPES.has(e.type)) {
      const d = e.data as { text?: string; content?: string } | undefined;
      const text = d?.text ?? d?.content;
      if (text != null && String(text).length > 0) return String(text);
    }
  }
  return '';
}

function displayTextFromUserEvents(events: any[]): string {
  for (const e of events) {
    const d = e.data as { text?: string; content?: string } | undefined;
    const text = d?.text ?? d?.content;
    if (text != null && String(text).length > 0) return String(text);
  }
  return '';
}

function displayTextFromErrorEvents(events: any[]): string {
  for (const e of events) {
    const d = e.data as { message?: string; error?: string; text?: string } | undefined;
    const text = d?.message ?? d?.error ?? d?.text;
    if (text != null && String(text).length > 0) return String(text);
  }
  return '';
}

function displayTextForMessage(role: string, content: any[]): string {
  if (role === 'user') return displayTextFromUserEvents(content);
  if (role === 'error') return displayTextFromErrorEvents(content);
  return displayTextFromAssistantEvents(content);
}

const App: React.FC = () => {
  const { send, messages: melonyMessages, streaming: isSendingMessage, reset } = useStudioMelony();

  // Chat state
  const [chatSessionId, setChatSessionId] = useState(() => generateId());
  const [chatInput, setChatInput] = useState('');
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Render chat directly from useMelony messages
  const displayMessages = useMemo(() => {
    return melonyMessages.map(msg => ({
      id: msg.runId || generateId(),
      role: toDisplayRole(msg.role),
      content: displayTextForMessage(msg.role, msg.content),
    }));
  }, [melonyMessages]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [displayMessages, isSendingMessage]);

  const clearRuns = async () => {
    reset();
  };

  const startNewSession = () => {
    const newId = generateId();
    setChatSessionId(newId);
    setChatInput('');
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
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-zinc-300 overflow-hidden font-sans selection:bg-zinc-500/30">
      <Analytics />

      <LeftSidebar
        groupedRuns={[]}
        chatSessionId={chatSessionId}
        onClearRuns={clearRuns}
        onStartNewSession={startNewSession}
        onSelectSession={handleSelectSession}
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
    </div>
  );
};

export default App;
