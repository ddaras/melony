import { useState, useRef, useEffect, useMemo } from "react";
import { useMelony } from "@/hooks/use-melony";
import { cn } from "@/lib/utils";
import { StarterPrompt, ComposerOptionGroup } from "@/types";
import { Composer } from "./composer";
import { StarterPrompts } from "./starter-prompts";
import { MessageList } from "./message-list";
import { useThreads } from "@/hooks/use-threads";
import { LoadingIndicator } from "./loading-indicator";

interface ThreadProps {
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  options?: ComposerOptionGroup[];
  autoFocus?: boolean;
  defaultSelectedIds?: string[];
}

export function Thread({
  placeholder = "Type a message...",
  starterPrompts: localStarterPrompts,
  options: localOptions,
  autoFocus = false,
  defaultSelectedIds,
}: ThreadProps) {
  const { activeThreadId, threadEvents, isLoadingEvents } = useThreads();

  const {
    messages: initialMessages,
    isLoading,
    error,
    sendEvent,
    loadingStatus,
    config,
  } = useMelony({
    initialEvents: threadEvents,
  });

  // Filter messages for the main thread:
  // 1. Only include user and assistant roles
  // 2. Exclude events that are targeted to a specific surface (like 'canvas')
  const messages = useMemo(() => {
    return initialMessages
      .map((msg) => ({
        ...msg,
        content: msg.content.filter((event) => !event.surface),
      }))
      .filter(
        (msg) =>
          ["user", "assistant"].includes(msg.role) && msg.content.length > 0,
      );
  }, [initialMessages]);

  const starterPrompts = localStarterPrompts ?? config?.starterPrompts;
  const options = localOptions ?? config?.options;

  const fileAttachments = config?.fileAttachments;

  // Extract defaultSelectedIds from all option groups and combine with explicitly passed ones
  const allDefaultSelectedIds = useMemo(() => {
    const defaultSelectedIdsFromOptions =
      options?.flatMap((group) => group.defaultSelectedIds ?? []) ?? [];

    return [
      ...new Set([
        ...defaultSelectedIdsFromOptions,
        ...(defaultSelectedIds ?? []),
      ]),
    ];
  }, [options, defaultSelectedIds]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (
    state?: Record<string, any>,
    overrideInput?: string,
  ) => {
    const text = (overrideInput ?? input).trim();
    const hasFiles =
      state?.files && Array.isArray(state.files) && state.files.length > 0;

    // Allow submission if there's text OR files OR options
    if ((!text && !hasFiles) || isLoading) return;

    if (!overrideInput) setInput("");

    await sendEvent({
      type: "text",
      role: "user",
      data: { content: text || "" },
      state: {
        ...state,
        threadId: activeThreadId ?? undefined,
      },
    });
  };

  const showStarterPrompts =
    messages.length === 0 &&
    starterPrompts &&
    starterPrompts.length > 0 &&
    !isLoadingEvents;

  return (
    <div className="relative flex flex-col h-full bg-background flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 pb-36">
        <div
          className={cn(
            "max-w-[48rem] mx-auto w-full p-4",
            showStarterPrompts && "min-h-full flex flex-col",
          )}
        >
          {isLoadingEvents && messages.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <LoadingIndicator status={{ message: "Loading messages..." }} />
            </div>
          ) : (
            <>
              {showStarterPrompts && (
                <StarterPrompts prompts={starterPrompts} />
              )}
              <MessageList
                messages={messages}
                isLoading={isLoading}
                error={error}
                loadingStatus={loadingStatus}
              />
            </>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 p-4 w-full">
        <div className="max-w-[48rem] mx-auto">
          <Composer
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            placeholder={placeholder}
            isLoading={isLoading}
            options={options}
            autoFocus={autoFocus}
            defaultSelectedIds={allDefaultSelectedIds}
            fileAttachments={fileAttachments}
          />
        </div>
      </div>
    </div>
  );
}
