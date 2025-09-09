import React from "react";

export interface ConversationProps {
  children?: React.ReactNode;
  className?: string;
}

export function Conversation(props: ConversationProps) {
  return (
    <div
      className={props.className}
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {props.children}
    </div>
  );
}
