import { useConversation } from "../hooks/useConversation";
import { MessageItem } from "./MessageItem";

type MessageListProps = {
  className?: string;
  userBubbleClassName?: string;
  assistantBubbleClassName?: string;
  systemBubbleClassName?: string;
};

export function MessageList({
  className,
  userBubbleClassName,
  assistantBubbleClassName,
  systemBubbleClassName,
}: MessageListProps) {
  const { messages } = useConversation();

  const defaultContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem", // gap-3
    padding: "1rem", // p-4
  };


  return (
    <div
      data-ai-message-list=""
      className={className}
      style={className ? undefined : defaultContainerStyle}
    >
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          userBubbleClassName={userBubbleClassName}
          assistantBubbleClassName={assistantBubbleClassName}
          systemBubbleClassName={systemBubbleClassName}
        />
      ))}
    </div>
  );
}
