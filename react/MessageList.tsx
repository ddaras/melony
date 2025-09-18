import { useConversation } from "./useConversation";
import { MessageItem } from "./MessageItem";

type MessageListProps = {
  userBubbleClassName?: string;
  assistantBubbleClassName?: string;
  systemBubbleClassName?: string;
};

export function MessageList({
  userBubbleClassName,
  assistantBubbleClassName,
  systemBubbleClassName,
}: MessageListProps) {
  const { messages } = useConversation();

  return (
    <>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          userBubbleClassName={userBubbleClassName}
          assistantBubbleClassName={assistantBubbleClassName}
          systemBubbleClassName={systemBubbleClassName}
        />
      ))}
    </>
  );
}
