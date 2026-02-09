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
      <div className="relative flex flex-col w-full border-border/60 border rounded-[26px] bg-muted/30 focus-within:bg-background focus-within:border-border focus-within:ring-[3px] focus-within:ring-primary/5 transition-all p-1.5 px-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[44px] max-h-[200px] border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-[15px] resize-none leading-relaxed"
          autoFocus={autoFocus}
        />
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-1 px-2">
            {/* Add attachment/tool icons here later if needed */}
          </div>
          {streaming ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full border border-border/40 hover:bg-muted"
              onClick={() => onStop?.()}
            >
              <div className="w-2.5 h-2.5 bg-foreground rounded-[1px]" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!value.trim()}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-300",
                value.trim() ? "bg-foreground text-background hover:opacity-90" : "bg-muted text-muted-foreground opacity-50"
              )}
              onClick={() => onSubmit()}
            >
              <Icon name="ArrowUp" size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
