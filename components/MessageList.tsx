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

  const defaultContainerStyle: React.CSSProperties = {
    height: "100%",
    overflow: "auto",
  };

  const defaultInnerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "1rem",
    width: "100%",
    maxWidth: "740px",
    margin: "0 auto",
    padding: "1rem",
  };

  return (
    <StickToBottom.Content
      id="message-list"
      className={className}
      style={className ? undefined : defaultContainerStyle}
    >
      <div style={defaultInnerStyle}>
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
      </div>
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
