import React, { useMemo } from "react";
import { Message } from "@/types";
import { MessageBubble } from "./message";
import { LoadingIndicator } from "./loading-indicator";
import { ErrorDisplay } from "./error-display";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  error?: Error | null;
  loadingStatus?: {
    message: string;
    details?: string;
  };
}

export function MessageList({ messages, isLoading, error, loadingStatus }: MessageListProps) {
  if (messages.length === 0) {
    return null;
  }

  // Check if the last message has text-delta events (text is streaming)
  const isTextStreaming = useMemo(() => {
    if (messages.length === 0 || !isLoading) return false;
    const lastMessage = messages[messages.length - 1];
    return lastMessage.content.some(event => event.type === "text-delta");
  }, [messages, isLoading]);

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
      {isLoading && !isTextStreaming && <LoadingIndicator status={loadingStatus} />}
      {error && <ErrorDisplay error={error} />}
    </div>
  );
}

