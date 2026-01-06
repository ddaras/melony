import { useState, useRef, useEffect, useMemo } from "react";
import { useMelony } from "@/hooks/use-melony";
import { cn } from "@/lib/utils";
import { StarterPrompt, ComposerOptionGroup, Message } from "@/types";
import { Event } from "melony";
import { Composer } from "./composer";
import { StarterPrompts } from "./starter-prompts";
import { MessageList } from "./message-list";
import { useThreads } from "@/hooks/use-threads";
import { LoadingIndicator } from "./loading-indicator";

interface ThreadProps {
  className?: string;
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  onStarterPromptClick?: (prompt: string) => void;
  options?: ComposerOptionGroup[];
  autoFocus?: boolean;
  defaultSelectedIds?: string[];
}

export function Thread({
  className,
  placeholder = "Type a message...",
  starterPrompts: localStarterPrompts,
  onStarterPromptClick,
  options: localOptions,
  autoFocus = false,
  defaultSelectedIds,
}: ThreadProps) {
  const { activeThreadId, threadEvents, isLoadingEvents } = useThreads();

  const { messages, isLoading, error, sendEvent, loadingStatus, config } =
    useMelony({
      initialEvents: threadEvents,
    });

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
    overrideInput?: string
  ) => {
    const text = (overrideInput ?? input).trim();
    const hasFiles =
      state?.files && Array.isArray(state.files) && state.files.length > 0;
    const hasOptions =
      state && Object.keys(state).filter((k) => k !== "threadId").length > 0;

    // Allow submission if there's text OR files OR options
    if ((!text && !hasFiles && !hasOptions) || isLoading) return;

    if (!overrideInput) setInput("");

    await sendEvent(
      {
        type: "text",
        role: "user",
        data: { content: text || "" },
      },
      {
        state: {
          ...state,
          threadId: activeThreadId ?? undefined,
        },
      }
    );
  };

  const handleStarterPromptClick = (prompt: string) => {
    if (onStarterPromptClick) {
      onStarterPromptClick(prompt);
    } else {
      handleSubmit(undefined, prompt);
    }
  };

  const showStarterPrompts =
    messages.length === 0 &&
    starterPrompts &&
    starterPrompts.length > 0 &&
    !isLoadingEvents;

  return (
    <div
      className={cn("relative flex flex-col h-full bg-background", className)}
    >
      <div className="flex-1 overflow-y-auto p-4 pb-36">
        <div
          className={cn(
            "max-w-[48rem] mx-auto w-full p-4",
            showStarterPrompts && "min-h-full flex flex-col"
          )}
        >
          {isLoadingEvents && messages.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <LoadingIndicator status={{ message: "Loading messages..." }} />
            </div>
          ) : (
            <>
              {showStarterPrompts && (
                <StarterPrompts
                  prompts={starterPrompts}
                  onPromptClick={handleStarterPromptClick}
                />
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
