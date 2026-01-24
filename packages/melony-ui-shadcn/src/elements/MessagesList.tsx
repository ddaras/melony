import { AggregatedMessage } from "@melony/react";
import { MessageBubble } from "./Message";

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

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}

      {streaming && (
        <div className="text-sm text-muted-foreground">
          {loadingStatus?.message || "Processing..."}
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive">
          {error.message}
        </div>
      )}
    </div>
  );
}
