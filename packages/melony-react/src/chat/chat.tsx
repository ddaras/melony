import React, { useState } from "react";
import { ChatList } from "./chat-list";
import { ChatInput } from "./chat-input";
import { useTheme } from "../theme";
import { useMelony } from "../melony-context";
import { Col } from "../components";

export interface ChatProps {
  /**
   * API endpoint for the chat. Required if not using MelonyStoreProvider.
   * @deprecated Use MelonyStoreProvider with api option instead
   */
  api?: string;
  className?: string;
  components?: Record<string, React.FC<any>>;
  /**
   * Optional: provide specific threadId to use.
   * If using MelonyStoreProvider, this is handled automatically.
   */
  threadId?: string;
  /**
   * Messages to display. If using MelonyStoreProvider, these come from the store.
   */
  messages?: any[];
  /**
   * Loading state. If using MelonyStoreProvider, this comes from the store.
   */
  isLoading?: boolean;
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
}

/**
 * Chat component - fully event-based.
 * 
 * All actions dispatch events through MelonyContext:
 * - "sendMessage" - Send a message (creates thread if needed)
 * - "createThread" - Create a new thread
 * 
 * Can be used standalone or with MelonyStoreProvider for full thread management.
 */
export function Chat({
  api,
  components,
  threadId,
  messages = [],
  isLoading = false,
  placeholder = "Type a message...",
}: ChatProps) {
  const theme = useTheme();
  const { dispatchEvent } = useMelony();
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageContent = input.trim();
    setInput("");

    // Dispatch sendMessage event - the store/provider will handle:
    // - Creating thread if none exists
    // - Adding the message
    // - Sending to API
    dispatchEvent({
      type: "sendMessage",
      data: {
        threadId,
        role: "user",
        content: [
          {
            type: "text",
            data: { content: messageContent, state: "done" },
          },
        ],
      },
    });
  };

  const hasMessages = messages.length > 0;

  return (
    <Col
      width="100%"
      height="100%"
      overflow="hidden"
      position="relative"
      style={{ backgroundColor: theme.colors?.background || "#ffffff" }}
    >
      <Col width="100%" height="100%" overflow="auto">
        <ChatList
          messages={messages}
          isLoading={isLoading}
          components={components}
        />
      </Col>
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        centered={!hasMessages}
      />
    </Col>
  );
}
