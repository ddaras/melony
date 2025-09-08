import React, { createContext, useContext, useState } from "react";
import { Message } from "../core/messages";

type ConversationContextType = {
  messages: Message[];
  send: (msg: Omit<Message, "id" | "createdAt">) => void;
};

export const ConversationContext =
  createContext<ConversationContextType | null>(null);

export function ConversationProvider({
  children,
  client,
}: {
  children: React.ReactNode;
  client: any;
}) {
  const [messages, setMessages] = useState<Message[]>([]);

  const send = (msg: Omit<Message, "id" | "createdAt">) => {
    const full: Message = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...msg,
    };
    setMessages((m) => [...m, full]);
    client.send(full); // SSE/WS/HTTP call
  };

  return (
    <ConversationContext.Provider value={{ messages, send }}>
      {children}
    </ConversationContext.Provider>
  );
}
