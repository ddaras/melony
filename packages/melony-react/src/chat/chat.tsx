import React, { useState, useEffect, useRef } from "react";
import { ChatList } from "./chat-list";
import { ChatInput } from "./chat-input";
import { useTheme } from "../theme";
import { useMelonyChat } from "../use-melony-chat";
import { useDispatchedEvent } from "../melony-context";
import { useMelonyThreads } from "../use-melony-threads";
import { Col } from "../components";

export interface ChatProps {
  api?: string;
  className?: string;
  components?: Record<string, React.FC<any>>;
  enableThreads?: boolean;
  storageKey?: string;
  threadId?: string; // Optional: provide specific threadId to use
}

export function Chat({
  api = "/api/chat",
  className,
  components,
  enableThreads = false,
  storageKey,
  threadId: providedThreadId,
}: ChatProps) {
  const theme = useTheme();

  // Thread management
  const {
    activeThreadId,
    getActiveThread,
    updateThreadTitle,
    updateThreadPreview,
    createThread,
  } = useMelonyThreads({
    storageKey,
    initialThreadId: providedThreadId ? undefined : undefined, // Will be set via threadId prop
  });

  // Get the threadId to use (from prop, active thread, or create new)
  const activeThread = getActiveThread();
  const currentThreadId = providedThreadId || activeThread?.threadId;

  // Create initial thread if threads are enabled and no thread exists
  useEffect(() => {
    if (enableThreads && !activeThread && !providedThreadId) {
      createThread();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableThreads, activeThread, providedThreadId]);

  const { messages, sendMessage, isLoading } = useMelonyChat({
    api,
    threadId: currentThreadId,
  });

  // Track last processed message to prevent infinite loops
  const lastProcessedMessageRef = useRef<string | null>(null);
  const lastProcessedThreadIdRef = useRef<string | null>(null);

  // Update thread title and preview when messages change
  useEffect(() => {
    if (
      enableThreads &&
      activeThreadId &&
      activeThread &&
      messages.length > 0
    ) {
      // Reset tracking if thread changed
      if (lastProcessedThreadIdRef.current !== activeThreadId) {
        lastProcessedThreadIdRef.current = activeThreadId;
        lastProcessedMessageRef.current = null;
      }

      const firstUserMessage = messages.find((m) => m.role === "user");
      if (firstUserMessage) {
        const textContent = firstUserMessage.content.find(
          (e) => e.type === "text"
        )?.data?.content as string | undefined;

        if (textContent && activeThread.title === "New Chat") {
          // Update title from first message (truncate to 50 chars)
          const title = textContent.slice(0, 50).trim();
          updateThreadTitle(activeThread.id, title || "New Chat");
        }
      }

      // Update preview from last message
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        const textContent = lastMessage.content.find((e) => e.type === "text")
          ?.data?.content as string | undefined;

        if (textContent) {
          const preview = textContent.slice(0, 100).trim();
          // Create a unique key for this message to track if we've processed it
          const messageKey = `${lastMessage.role}-${preview}`;

          // Only update if this is a new message we haven't processed yet
          if (lastProcessedMessageRef.current !== messageKey) {
            lastProcessedMessageRef.current = messageKey;
            updateThreadPreview(activeThread.id, preview);
          }
        }
      }
    }
  }, [
    messages,
    enableThreads,
    activeThreadId,
    activeThread?.id,
    activeThread?.title,
    updateThreadTitle,
    updateThreadPreview,
  ]);

  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Convert string to events array for consistency
    sendMessage({
      role: "user",
      content: [
        {
          type: "text",
          data: { content: input.trim(), state: "done" },
        },
      ],
    });

    setInput("");
  };

  useDispatchedEvent((evt) => {
    if (evt.type === "sendSystemMessage") {
      sendMessage({
        role: "system",
        content: [evt],
      });
    }
  });

  useDispatchedEvent((evt) => {
    if (evt.type === "sendUserMessage") {
      sendMessage({
        role: "user",
        content: [evt],
      });
    }
  });

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
          sendMessage={sendMessage}
        />
      </Col>
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        centered={!hasMessages}
      />
    </Col>
  );
}
