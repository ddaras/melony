import React, { useState, useRef, useEffect } from "react";
import { useMelony } from "@/hooks/use-melony";
import { cn } from "@/lib/utils";
import { UIRenderer } from "@/components/ui-renderer";
import { StarterPrompt } from "@/types";
import { Composer } from "./composer";

export function Thread({
  className,
  placeholder = "Type a message...",
  starterPrompts,
  onStarterPromptClick,
}: {
  className?: string;
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  onStarterPromptClick?: (prompt: string) => void;
}) {
  const { messages, isLoading, error, sendEvent } = useMelony();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault();
    const text = (overrideInput ?? input).trim();
    if (!text || isLoading) return;

    if (!overrideInput) setInput("");
    await sendEvent({
      type: "text",
      role: "user",
      data: { content: text },
    });
  };

  const handleStarterPromptClick = (prompt: string) => {
    if (onStarterPromptClick) {
      onStarterPromptClick(prompt);
    } else {
      handleSubmit(undefined, prompt);
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="max-w-4xl mx-auto w-full">
          {messages.length === 0 &&
            starterPrompts &&
            starterPrompts.length > 0 && (
              <div className="flex flex-col items-center justify-center min-h-[300px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    What can I help with today?
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                  {starterPrompts.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleStarterPromptClick(item.prompt)}
                      className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-all text-left group"
                    >
                      {item.icon && (
                        <div className="p-2 rounded-lg bg-muted group-hover:bg-background transition-colors">
                          {item.icon}
                        </div>
                      )}
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2 space-y-2",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "px-0 py-0 text-foreground"
                )}
              >
                {message.content.map((event, j) => {
                  if (event.type === "text-delta")
                    return <span key={j}>{event.data?.delta}</span>;
                  if (event.type === "text")
                    return (
                      <p key={j}>{event.data?.content || event.data?.text}</p>
                    );
                  if (event.ui) return <UIRenderer key={j} node={event.ui} />;
                  return null;
                })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-muted-foreground animate-pulse">
              Thinking...
            </div>
          )}
          {error && (
            <div className="text-destructive p-2 border border-destructive rounded-md bg-destructive/10">
              {error.message}
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t w-full">
        <div className="max-w-4xl mx-auto">
          <Composer
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            placeholder={placeholder}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
