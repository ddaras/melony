import React from "react";
import { StickToBottom } from "use-stick-to-bottom";

export interface ConversationProps {
  children?: React.ReactNode;
  className?: string;
}

export function Conversation(props: ConversationProps) {
  return (
    <StickToBottom
      id="conversation"
      className={props.className}
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "0",
      }}
    >
      {props.children}
    </StickToBottom>
  );
}
