import React, { createContext, useEffect, useState } from "react";
import { Message } from "../core/types";
import { AIAdapter } from "../core/adapter";

type ConversationContextType = {
  messages: Message[];
  send: (message: string) => void;
  isStreaming: boolean;
  lastMessage: Message | null;
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
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // Listen to backend stream
  useEffect(() => {
    if (!adapter) return;
    const subscription = adapter.subscribe((msg: Message) => {
      setMessages((prev) => {
        // Check if this is an update to an existing assistant message
        const existingIndex = prev.findIndex(
          (m) => m.role === "assistant" && m.id === msg.id
        );

        let updatedMessages;
        if (existingIndex >= 0) {
          // Update existing message
          const updated = [...prev];
          updated[existingIndex] = msg;
          updatedMessages = updated;
        } else {
          // Add new message
          updatedMessages = [...prev, msg];
        }

        // Check if any message is currently streaming
        const hasStreamingMessage = updatedMessages.some(
          (message) => message.streamingState?.isStreaming === true
        );
        setIsStreaming(hasStreamingMessage);

        return updatedMessages;
      });
    });
    return () => subscription.unsubscribe();
  }, [adapter]);

  const send = (message: string) => {
    const full: Message = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      parts: [{ type: "text", text: message }],
      role: "user",
    };

    const newMessages = [...messages, full];

    setMessages(newMessages);
    setIsStreaming(true);
    adapter.send(message);
  };

  return (
    <ConversationContext.Provider
      value={{
        messages,
        send,
        isStreaming,
        lastMessage:
          messages?.length > 0 ? messages[messages.length - 1] : null,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}
