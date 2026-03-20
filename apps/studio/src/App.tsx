import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useMelony } from '@melony/react';
import ChatPanel from './components/chat-panel';
import LeftSidebar from './components/left-sidebar';
import { generateId } from 'melony';

const toDisplayRole = (role: string): 'user' | 'assistant' | 'error' => {
  if (role === 'user' || role === 'assistant' || role === 'error') {
    return role;
  }

  return 'assistant';
};

const App: React.FC = () => {
  const { send, messages: melonyMessages, streaming: isSendingMessage, reset } = useMelony();

  // Chat state
  const [chatSessionId, setChatSessionId] = useState(() => generateId());
  const [chatInput, setChatInput] = useState('');
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Render chat directly from useMelony messages
  const displayMessages = useMemo(() => {
    return melonyMessages.map(msg => ({
      id: msg.runId || generateId(),
      role: toDisplayRole(msg.role),
      content: msg?.content?.find(e => !!e?.data?.text)?.data?.text ?? msg.content.map(e => e.data?.delta ?? '').join('')
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
