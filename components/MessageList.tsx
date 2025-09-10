import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
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
  const { messages, isStreaming } = useConversation();

  return (
    <StickToBottom.Content
      id="message-list"
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "740px",
        margin: "0 auto",
        padding: "1rem",
      }}
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

      {isStreaming && <div>...</div>}

      <ScrollToBottom />
    </StickToBottom.Content>
  );
}

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <button
        className="absolute i-ph-arrow-circle-down-fill text-4xl rounded-lg left-[50%] translate-x-[-50%] bottom-0"
        onClick={() => scrollToBottom()}
      />
    )
  );
}
