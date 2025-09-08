import React from "react";

export interface ConversationProps {
  children?: React.ReactNode;
  className?: string;
}

export function Conversation(props: ConversationProps) {
  return (
    <div
      data-ai-conversation=""
      className={props.className}
      style={{ display: "contents" }}
    >
      {props.children}
    </div>
  );
}
