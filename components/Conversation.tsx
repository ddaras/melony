import React from "react";
import { StickToBottom } from "use-stick-to-bottom";

export interface ConversationProps {
  children?: React.ReactNode;
  className?: string;
}

export function Conversation(props: ConversationProps) {
  return (
    <StickToBottom
      className={props.className}
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "0 1rem",
      }}
    >
      {props.children}
    </StickToBottom>
  );
}
