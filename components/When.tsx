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
  if (
    tool &&
    lastMessage.parts.some(
      (part) => part.type === "tool" && part.toolCallId === tool
    )
  )
    return <>{children}</>;

  return null;
};
