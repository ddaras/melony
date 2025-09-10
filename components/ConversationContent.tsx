import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { useConversation } from "../hooks/useConversation";

type MessageListProps = {
  className?: string;
  children?: React.ReactNode;
};

export function ConversationContent({ children, className }: MessageListProps) {
  const { isStreaming } = useConversation();

  return (
    <StickToBottom.Content
      id="conversation-content"
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "740px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      {children}

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
