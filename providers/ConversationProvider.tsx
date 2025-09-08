import React, { createContext, useContext } from 'react';
import type { Message } from '../core/messages';
import { useConversation } from '../hooks/useConversation';

interface ConversationContextValue {
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  append: (m: Message) => void;
}

const ConversationContext = createContext<ConversationContextValue | null>(null);

export function ConversationProvider({ children }: { children?: React.ReactNode }) {
  const value = useConversation();
  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
}

export function useConversationContext() {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error('useConversationContext must be used within ConversationProvider');
  return ctx;
}
