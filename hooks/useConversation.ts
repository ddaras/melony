import { useState, useCallback } from 'react';
import type { Message } from '../core/messages';

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const append = useCallback((m: Message) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  return { messages, input, setInput, append };
}
