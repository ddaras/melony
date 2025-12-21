import React from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { IconArrowUp } from "@tabler/icons-react";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function Composer({
  value,
  onChange,
  onSubmit,
  placeholder = "Type a message...",
  isLoading,
  className,
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
        />
        <div className="flex justify-end items-center">
          <Button
            type="submit"
            disabled={(!value.trim() && !isLoading) || isLoading}
            size="icon-lg"
            onClick={() => onSubmit()}
          >
            <IconArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
