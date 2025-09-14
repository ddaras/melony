import React from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { useConversation } from "../hooks/useConversation";

export interface ConversationProps {
  children?: React.ReactNode[];
  className?: string;
}

export function Conversation(props: ConversationProps) {
  const { isStreaming } = useConversation();

  return (
    <StickToBottom
      id="conversation"
      className={props.className}
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StickToBottom.Content
        id="conversation-content"
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "740px",
          margin: "0 auto",
          padding: "1rem",
        }}
      >
        {props.children?.slice(0, -1)}

        {isStreaming && <div>...</div>}
      </StickToBottom.Content>
      <ScrollToBottom />

      {props.children?.[props.children.length - 1]}
    </StickToBottom>
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
