import React from "react";

export interface ConversationProps {
  children?: React.ReactNode;
  className?: string;
}

export function Conversation(props: ConversationProps) {
  return (
    <div
      className={props.className}
      style={{ height: "100%", padding: "1rem", overflow: "hidden" }}
    >
      {props.children}
    </div>
  );
}
