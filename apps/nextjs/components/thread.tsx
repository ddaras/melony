import { useState, useRef, useEffect, useMemo } from "react";
import { useMelony } from "@melony/react";
import { cn } from "@/lib/utils";
import { StarterPrompt, ComposerOptionGroup } from "@/types";
import { Composer } from "./composer";
import { StarterPrompts } from "./starter-prompts";
import { MessageList } from "./message-list";
import { useThreads } from "@/hooks/use-threads";
import { LoadingIndicator } from "./loading-indicator";
import { AggregatedMessage } from "@/lib/message-converter";

interface ThreadProps {
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  options?: ComposerOptionGroup[];
  messages?: AggregatedMessage[];
  autoFocus?: boolean;
  defaultSelectedIds?: string[];
  fileAttachments?: {
    enabled?: boolean;
    accept?: string;
    maxFiles?: number;
    maxFileSize?: number;
  };
}

export function Thread({
  placeholder = "Type a message...",
  starterPrompts: localStarterPrompts,
  options: localOptions,
  messages: propMessages,
  autoFocus = false,
  defaultSelectedIds,
  fileAttachments,
}: ThreadProps) {
  const { activeThreadId, threadEvents, isLoadingEvents } = useThreads();

  const {
    isLoading,
    error,
    sendEvent,
    loadingStatus,
    config,
  } = useMelony();

  // Use prop messages or empty array, filter for main thread
  // 1. Only include user and assistant roles
  // 2. UI events are already separated in aggregated messages
  const messages = useMemo(() => {
    return (propMessages || []).filter((msg) =>
      ["user", "assistant"].includes(msg.role)
    );
  }, [propMessages]);

  const starterPrompts = localStarterPrompts;
  const options = localOptions;

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
      data: { content: text || "" },
      meta: {
        role: "user",
        state: {
          ...state,
          threadId: activeThreadId ?? undefined,
        },
      } as any,
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
            "max-w-3xl mx-auto w-full p-4",
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
        <div className="max-w-3xl mx-auto">
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
