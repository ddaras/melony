import { useMemo } from 'react';
import type { Message } from '../core/messages';

export function useMessages(messages: Message[]) {
  const byRole = useMemo(() => {
    return messages.reduce<Record<string, Message[]>>((acc, m) => {
      (acc[m.role] ||= []).push(m);
      return acc;
    }, {});
  }, [messages]);

  return { byRole };
}
