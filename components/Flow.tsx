import React from "react";
import { useConversation } from "../hooks/useConversation";

type FlowWhenProps = {
  tool?: string;
  block?: string;
  children: React.ReactNode;
};

export const FlowWhen: React.FC<FlowWhenProps> = ({
  tool,
  block,
  children,
}) => {
  const { messages } = useConversation();

  // Get latest message
  const latest = messages[messages.length - 1];

  if (!latest) return null;

  // Check tool match
  if (tool && latest.toolCall?.name === tool) return <>{children}</>;

  // Check block match
  if (block && Array.isArray(latest.content)) {
    const hasBlock = latest.content.some((b: any) => b.type === block);
    if (hasBlock) return <>{children}</>;
  }

  return null;
};

export const Flow = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

Flow.When = FlowWhen;
