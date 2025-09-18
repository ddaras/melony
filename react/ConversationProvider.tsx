import React, { createContext, useEffect, useMemo, useState } from "react";
import { Message } from "../core/types";
import { StreamingHandlerOptions } from "../core/types";
import { GenericStreamingAdapter } from "../core/generic-streaming-handler";

type ConversationContextType = {
  messages: Message[];
  send: (message: string) => void;
};

export const ConversationContext =
  createContext<ConversationContextType | null>(null);

export function ConversationProvider({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: StreamingHandlerOptions;
}) {
  const defaultAdapter = useMemo(
    () => new GenericStreamingAdapter(options),
    [options]
  );

  const [messages, setMessages] = useState<Message[]>([]);

  // Listen to backend stream
  useEffect(() => {
    const subscription = defaultAdapter.subscribe((msg: Message) => {
      if (options?.debug) console.log("msg", msg);

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

        return updatedMessages;
      });
    });
    return () => subscription.unsubscribe();
  }, [defaultAdapter]);

  const send = (message: string) => {
    const full: Message = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      parts: [{ type: "text", text: message }],
      role: "user",
    };

    const newMessages = [...messages, full];

    setMessages(newMessages);
    defaultAdapter.send(message);
  };

  return (
    <ConversationContext.Provider
      value={{
        messages,
        send,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}
