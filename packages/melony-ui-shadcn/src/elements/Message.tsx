import { AggregatedMessage } from "@melony/react";
import { cn } from "@/lib/utils";
import { MessageContent } from "./MessageContent";

interface MessageProps {
  message: AggregatedMessage;
}

export function MessageBubble({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex flex-col w-full", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "flex flex-col items-start max-w-[85%] transition-all duration-200",
          isUser
            ? "bg-muted/80 text-foreground px-3 py-1.5 rounded-lg"
            : "px-0 py-0 text-foreground w-full",
        )}
      >
        <MessageContent content={message.content} />
      </div>
    </div>
  );
}
