import React from "react";
import { Message } from "@/types";
import { MessageBubble } from "./message";
import { LoadingIndicator } from "./loading-indicator";
import { ErrorDisplay } from "./error-display";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  error?: Error | null;
}

export function MessageList({ messages, isLoading, error }: MessageListProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
      {isLoading && <LoadingIndicator />}
      {error && <ErrorDisplay error={error} />}
    </div>
  );
}

