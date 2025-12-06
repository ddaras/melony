import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { useTheme } from "../theme";
import { type ChatMessage as ChatMessageType } from "@melony/client";
import { Col } from "../components";

export interface ChatListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  components?: Record<string, React.FC<any>>;
  sendMessage?: (message: any, options?: any) => Promise<any>;
}

export function ChatList({
  messages,
  isLoading,
  components,
  sendMessage,
}: ChatListProps) {
  const theme = useTheme();
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      style={{
        maxWidth: "48rem",
        width: "100%",
        padding: "20px 0",
        margin: "0 auto",
      }}
    >
      <Col gap="lg">
        {messages.map((message, index) => (
          <ChatMessage
            key={`message-${index}`}
            message={message}
            components={components}
            sendMessage={sendMessage}
          />
        ))}
        {isLoading && (
          <div style={{ padding: theme.spacing?.xs || "0.25rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  gap: "0.2rem",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: theme.colors?.mutedForeground || "#a1a1aa",
                    animation: "thinking-dot 1.4s ease-in-out infinite",
                    animationDelay: "0s",
                  }}
                />
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: theme.colors?.mutedForeground || "#a1a1aa",
                    animation: "thinking-dot 1.4s ease-in-out infinite",
                    animationDelay: "0.2s",
                  }}
                />
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: theme.colors?.mutedForeground || "#a1a1aa",
                    animation: "thinking-dot 1.4s ease-in-out infinite",
                    animationDelay: "0.4s",
                  }}
                />
              </span>
              <style>
                {`
                  @keyframes thinking-dot {
                    0%, 60%, 100% {
                      transform: translateY(0);
                      opacity: 0.7;
                    }
                    30% {
                      transform: translateY(-6px);
                      opacity: 1;
                    }
                  }
                `}
              </style>
            </div>
          </div>
        )}
        <div ref={endRef} style={{ height: "64px" }} />
      </Col>
    </div>
  );
}
