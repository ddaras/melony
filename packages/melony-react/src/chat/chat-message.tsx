import React from "react";
import { Renderer } from "../renderer";
import { useTheme } from "../theme";
import { type ChatMessage as ChatMessageType } from "@melony/client";
import { Col } from "../components";

export interface ChatMessageProps {
  message: ChatMessageType;
  components?: Record<string, React.FC<any>>;
}

// Helper to extract text content from message parts
export function getMessageText(message: any): string {
  // Handle different message formats
  if (Array.isArray(message.content)) {
    return message.content
      .filter((e: any) => e.type === "text")
      .map((e: any) => e.data?.content || "")
      .join("");
  }
  if (typeof message.content === "string") {
    return message.content;
  }
  if (message.parts) {
    const textParts = message.parts
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text || "");
    return textParts.join("");
  }
  return "";
}

export function ChatMessage({
  message,
  components,
}: ChatMessageProps) {
  const theme = useTheme();
  const messageText = getMessageText(message);
  const isUser = message.role === "user";
  const anyMessage = message;

  return (
    <Col align={isUser ? "end" : "start"} width="100%">
      {isUser ? (
        <div
          style={{
            maxWidth: "85%",
            padding: `${theme.spacing?.md} ${theme.spacing?.lg}`,
            borderRadius: theme.radius?.lg || "1.25rem",
            borderTopRightRadius: theme.radius?.sm || "0.25rem",
            borderTopLeftRadius: theme.radius?.lg || "1.25rem",
            backgroundColor: theme.colors?.primary || "#6366f1",
            color: "#ffffff",
            fontSize: theme.typography?.fontSize?.md,
            lineHeight: "1",
            whiteSpace: "pre-wrap",
          }}
        >
          {messageText}
        </div>
      ) : (
        <div
          style={{
            maxWidth: "85%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            gap: theme.spacing?.md,
            fontSize: theme.typography?.fontSize?.md,
            color: theme.colors?.foreground || "#ffffff",
          }}
        >
          {anyMessage.content.map((event: any, i: number) => {
            if (event.type === "text") {
              return (
                <Renderer
                  key={i}
                  nodes={event.data?.content || ""}
                  components={components}
                />
              );
            } else if (event.ui) {
              // Server-Driven UI Event
              return (
                <Renderer key={i} nodes={event.ui} components={components} />
              );
            } else {
              // Fallback for events without UI
              return <div key={i}>{JSON.stringify(event, null, 2)}</div>;
            }
          })}
        </div>
      )}
    </Col>
  );
}
