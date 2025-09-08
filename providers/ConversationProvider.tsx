import React, { createContext, useEffect, useState } from "react";
import { Message } from "../core/messages";
import { AIAdapter } from "../core/client";

type ConversationContextType = {
  messages: Message[];
  send: (msg: Omit<Message, "id" | "createdAt">) => void;
};

export const ConversationContext =
  createContext<ConversationContextType | null>(null);

export function ConversationProvider({
  children,
  adapter,
}: {
  children: React.ReactNode;
  adapter: AIAdapter;
}) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Listen to backend stream
  useEffect(() => {
    if (!adapter) return;
    const subscription = adapter.subscribe((msg: Message) => {
      setMessages((prev) => {
        // Check if this is an update to an existing assistant message
        const existingIndex = prev.findIndex(
          (m) => m.role === "assistant" && m.id === msg.id
        );

        if (existingIndex >= 0) {
          // Update existing message
          const updated = [...prev];
          updated[existingIndex] = msg;
          return updated;
        } else {
          // Add new message
          return [...prev, msg];
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [adapter]);

  const send = (msg: Omit<Message, "id" | "createdAt">) => {
    const full: Message = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...msg,
    };
    setMessages((m) => [...m, full]);
    adapter.send(full); // AI SDK backend (HTTP)
  };

  return (
    <ConversationContext.Provider value={{ messages, send }}>
      {children}
    </ConversationContext.Provider>
  );
}
