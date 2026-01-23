import { useMemo } from "react";
import { AggregatedMessage } from "@melony/react";
import { MessageBubble } from "./message";
import { LoadingIndicator } from "./loading-indicator";
import { ErrorDisplay } from "./error-display";

interface MessageListProps {
  messages: AggregatedMessage[];
  streaming?: boolean;
  error?: Error | null;
  loadingStatus?: {
    message: string;
    details?: string;
  };
}

export function MessageList({
  messages,
  streaming,
  error,
  loadingStatus,
}: MessageListProps) {
  if (messages.length === 0) {
    return null;
  }

  // Check if text is streaming (last message is from assistant and we're loading)
  const isTextStreaming = useMemo(() => {
    if (messages.length === 0 || !streaming) return false;
    const lastMessage = messages[messages.length - 1];
    return lastMessage.role === "assistant";
  }, [messages, streaming]);

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
      {streaming && !isTextStreaming && (
        <LoadingIndicator status={loadingStatus} />
      )}
      {error && <ErrorDisplay error={error} />}
    </div>
  );
}
