import React, { useState, useRef, useEffect } from "react";
import { useMelony } from "@/hooks/use-melony";
import { cn } from "@/lib/utils";
import { StarterPrompt } from "@/types";
import { Composer } from "./composer";
import { StarterPrompts } from "./starter-prompts";
import { MessageList } from "./message-list";

interface ThreadProps {
  className?: string;
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  onStarterPromptClick?: (prompt: string) => void;
}

export function Thread({
  className,
  placeholder = "Type a message...",
  starterPrompts,
  onStarterPromptClick,
}: ThreadProps) {
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

  const showStarterPrompts =
    messages.length === 0 && starterPrompts && starterPrompts.length > 0;

  return (
    <div className={cn("relative flex flex-col h-full bg-background", className)}>
      <div className="flex-1 overflow-y-auto p-4 pb-40">
        <div
          className={cn(
            "max-w-4xl mx-auto w-full",
            showStarterPrompts && "min-h-full flex flex-col"
          )}
        >
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
          />
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 p-4 w-full">
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
