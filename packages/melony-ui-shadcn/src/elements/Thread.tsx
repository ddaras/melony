import { useState, useRef, useEffect, useMemo } from "react";
import { useMelony, AggregatedMessage } from "@melony/react";
import { cn } from "@/lib/utils";
import { Composer } from "./Composer";
import { MessageList } from "./MessagesList";
import { Icon } from "./Icon";

interface ThreadProps {
  placeholder?: string;
  messages?: AggregatedMessage[];
  autoFocus?: boolean;
  welcomeTitle?: string;
  welcomeMessage?: string;
  suggestions?: string[];
}

export function Thread({
  placeholder = "Type a message...",
  messages: propMessages,
  autoFocus = false,
  welcomeTitle,
  welcomeMessage,
  suggestions,
}: ThreadProps) {
  const {
    streaming,
    error,
    send,
    messages: melonyMessages,
  } = useMelony();

  // Use prop messages or aggregated messages from melony context, filter for main thread
  // 1. Only include user and assistant roles
  // 2. UI events are already separated in aggregated messages
  const messages = useMemo(() => {
    return (propMessages || melonyMessages || []).filter((msg) =>
      ["user", "assistant"].includes(msg.role)
    );
  }, [propMessages, melonyMessages]);

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
    if ((!text && !hasFiles) || streaming) return;

    if (!overrideInput) setInput("");

    await send({
      type: "user:text",
      data: { content: text || "" },
    });
  };

  return (
    <div className="relative flex flex-col h-full bg-background flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 pb-36">
        <div
          className={cn(
            "max-w-3xl mx-auto w-full p-8",
          )}
        >
          {messages.length === 0 && !streaming && (welcomeTitle || welcomeMessage || suggestions) ? (
            <div className="flex flex-col items-start justify-center min-h-[50vh] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {welcomeTitle && (
                <h1 className="text-4xl md:text-5xl font-bold pb-2">
                  {welcomeTitle}
                </h1>
              )}
              {welcomeMessage && (
                <p className="text-xl text-muted-foreground max-w-lg">
                  {welcomeMessage}
                </p>
              )}
              {suggestions && suggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSubmit({}, suggestion)}
                      className="flex items-center justify-between p-4 rounded-2xl border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all text-left group"
                    >
                      <span className="text-sm font-medium">{suggestion}</span>
                      <Icon name="✨" size="sm" className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <MessageList
              messages={messages}
              streaming={streaming}
              error={error}
              loadingStatus={{
                message: "Processing..."
              }}
            />
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
            streaming={streaming}
            autoFocus={autoFocus}
          />
        </div>
      </div>
    </div>
  );
}
