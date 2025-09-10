import React from "react";
import { useConversation } from "../hooks/useConversation";

type WhenProps = {
  tool?: string;
  children: React.ReactNode;
};

export const When: React.FC<WhenProps> = ({ tool, children }) => {
  const { messages, lastMessage } = useConversation();

  if (!lastMessage) return null;

  // Check tool match
  if (tool && lastMessage.toolCalls?.some((tc) => tc.name === tool))
    return <>{children}</>;

  return null;
};
