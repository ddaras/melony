import { useState, useRef, useEffect, useMemo } from "react";
import { useMelony, AggregatedMessage } from "@melony/react";
import { cn } from "@/lib/utils";
import { Composer } from "./Composer";
import { MessageList } from "./MessagesList";
import { Button } from "./Button";
import { Text } from "./Text";
import { Heading } from "./Heading";

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
    stop,
    messages: melonyMessages,
  } = useMelony();

  // Use prop messages or aggregated messages from melony, filter for main thread
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
    <div className="relative flex flex-col h-full flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 pb-36">
        <div
          className={cn(
            "max-w-3xl mx-auto w-full p-4",
          )}
        >
          {messages.length === 0 && !streaming && (welcomeTitle || welcomeMessage || suggestions) ? (
            <div className="flex flex-col items-start justify-center min-h-[50vh] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {welcomeTitle && (
                <Heading value={welcomeTitle} level={1} />
              )}
              {welcomeMessage && (
                <Text value={welcomeMessage} size="lg" color="muted" />
              )}
              {suggestions && suggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
                  {suggestions.map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      justify="start"
                      onClickAction={{ type: "user:text", data: { content: suggestion } }}
                      label={suggestion}
                    />
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

      <div className="absolute bottom-0 p-4 md:pb-6 w-full bg-gradient-to-t from-background via-background/90 to-transparent">
        <div className="max-w-3xl mx-auto">
          <Composer
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onStop={stop}
            placeholder={placeholder}
            streaming={streaming}
            autoFocus={autoFocus}
          />
          <div className="mt-2 text-center">
             <p className="text-[10px] text-muted-foreground/60">
               Melony can make mistakes. Check important info.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
