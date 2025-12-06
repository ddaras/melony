import React from "react";
import { Response } from "../response";
import { useTheme } from "../theme";
import { useMelony } from "../melony-context";
import { Widget } from "../widget";
import { type ChatMessage } from "@melony/client";
import { MelonyEvent } from "@melony/core";
import { Text } from "../components/Text";
import { Col } from "../components";

export interface ChatMessageProps {
  message: ChatMessage;
  components?: Record<string, React.FC<any>>;
  sendMessage?: (message: any, options?: any) => Promise<any>;
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
  sendMessage,
}: ChatMessageProps) {
  const theme = useTheme();
  const { widgets } = useMelony();
  const messageText = getMessageText(message);
  const isUser = message.role === "user";
  const anyMessage = message as any;

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
      ) : Array.isArray(anyMessage.content) ? (
        <div
          style={{
            maxWidth: "85%",
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing?.md,
            fontSize: theme.typography?.fontSize?.md,
            color: theme.colors?.foreground || "#ffffff",
          }}
        >
          {anyMessage.content.map((event: any, i: number) => {
            if (event.type === "text") {
              return (
                <Response
                  key={i}
                  content={event.data?.content || ""}
                  components={components}
                />
              );
            } else {
              const widgetDef = widgets[event.type?.toLowerCase()];
              if (widgetDef) {
                return <Widget key={i} widget={widgetDef} data={event?.data} />;
              }
              return <div key={i}>{JSON.stringify(event, null, 2)}</div>;
            }
          })}
        </div>
      ) : (
        <div
          style={{
            maxWidth: "85%",
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing?.md,
            color: theme.colors?.foreground || "#ffffff",
          }}
        >
          {message.content.map((part: MelonyEvent, index) => {
            if (part.type === "data-widget") {
              return (
                <Widget
                  key={index}
                  widget={part.data?.widget}
                  data={part.data?.data}
                />
              );
            }

            return null;
          })}

          {anyMessage.type === "status" && <Text value={anyMessage.status} />}
          {anyMessage.type === "error" && (
            <Text value={anyMessage.error} color="danger" />
          )}
          {anyMessage.type === "widget" && (
            <Text value={JSON.stringify(anyMessage.data, null, 2)} />
          )}

          <Response content={messageText} components={components} />
        </div>
      )}
    </Col>
  );
}
