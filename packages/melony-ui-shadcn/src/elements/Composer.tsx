import React from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (state?: Record<string, any>) => void;
  onStop?: () => void;
  placeholder?: string;
  streaming?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function Composer({
  value,
  onChange,
  onSubmit,
  onStop,
  placeholder = "Type a message...",
  streaming,
  className,
  autoFocus = false
}: ComposerProps) {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={cn("relative flex flex-col w-full", className)}>
      <div className="relative flex flex-col w-full border-input border-[1.5px] rounded-3xl bg-background shadow-sm focus-within:border-ring transition-all p-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[44px] max-h-[200px] border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-[15px] resize-none"
          autoFocus={autoFocus}
        />
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-1">
          </div>
          {streaming ? (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => onStop?.()}
            >
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-foreground rounded-[2px]" />
                Stop
              </span>
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!value.trim()}
              size="default"
              onClick={() => onSubmit()}
            >
              <span>Send</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
