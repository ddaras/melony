import React, { createContext, useEffect, useMemo, useState } from "react";
import { Message } from "../core/types";
import { StreamingHandlerOptions } from "../core/types";
import { GenericStreamingAdapter } from "../core/generic-streaming-handler";

type ConversationContextType = {
  messages: Message[];
  send: (message: string) => Promise<void>;
  status: "idle" | "requested" | "streaming" | "error";
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
  const [status, setStatus] = useState<"idle" | "requested" | "streaming" | "error">("idle");

  // Listen to backend stream
  useEffect(() => {
    const subscription = defaultAdapter.subscribe((msg: Message) => {
      if (options?.debug) console.log("msg", msg);

      // Set status to streaming when we receive the first message
      setStatus("streaming");

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

    // Listen for completion events
    const completionSubscription = defaultAdapter.onCompletion(() => {
      if (options?.debug) console.log("streaming completed");
      setStatus("idle");
    });

    return () => {
      subscription.unsubscribe();
      completionSubscription.unsubscribe();
    };
  }, [defaultAdapter]);

  const send = async (message: string) => {
    const full: Message = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      parts: [{ type: "text", text: message }],
      role: "user",
    };

    const newMessages = [...messages, full];

    setMessages(newMessages);
    setStatus("requested");

    try {
      await defaultAdapter.send(message);
      // Status will be updated to "streaming" when we receive messages
      // and back to "idle" when streaming is complete
    } catch (error) {
      setStatus("error");
      // Optionally, you could emit an error message here
      console.error("Failed to send message:", error);
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        messages,
        send,
        status,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}
