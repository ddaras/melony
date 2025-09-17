import React from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

interface ConversationProps {
  children?: React.ReactNode[];
  className?: string;
}

function ConversationContainer({ children, className }: ConversationProps) {
  return (
    <StickToBottom
      id="conversation"
      className={className}
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
      <ScrollToBottom />
    </StickToBottom>
  );
}

interface ConversationContentProps {
  children?: React.ReactNode[];
  className?: string;
}

function ConversationContent({
  children,
  className,
}: ConversationContentProps) {
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
    </StickToBottom.Content>
  );
}

interface ConversationFooterProps {
  children?: React.ReactNode;
  className?: string;
}

function ConversationFooter({ children, className }: ConversationFooterProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "740px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      {children}
    </div>
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

// Compound component export
export const Conversation = {
  Container: ConversationContainer,
  Content: ConversationContent,
  Footer: ConversationFooter,
} as const;
