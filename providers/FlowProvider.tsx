import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Message } from "../core/messages";
import { useConversation } from "../hooks/useConversation";

type FlowContextType = {
  latestMessage: Message | null;
  history: Message[];
};

export const FlowContext = createContext<FlowContextType | null>(null);

export const FlowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { messages } = useConversation();
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    setLatestMessage(messages[messages.length - 1]);
  }, [messages]);

  const value: FlowContextType = {
    latestMessage,
    history: messages,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};
