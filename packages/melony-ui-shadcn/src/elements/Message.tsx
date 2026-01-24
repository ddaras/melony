import { AggregatedMessage } from "@melony/react";
import { cn } from "@/lib/utils";
import { MessageContent } from "./MessageContent";

interface MessageProps {
  message: AggregatedMessage;
}

export function MessageBubble({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "flex flex-col items-start max-w-[85%] rounded-2xl px-4 py-2 space-y-4 whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground"
            : "px-0 py-0 text-foreground",
        )}
      >
        <MessageContent text={message.content} uiEvents={message.uiEvents} />
      </div>
    </div>
  );
}
