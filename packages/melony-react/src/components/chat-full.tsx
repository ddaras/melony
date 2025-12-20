import React from "react";
import { Thread } from "./thread";
import { cn } from "@/lib/utils";
import { StarterPrompt } from "@/types";

export interface ChatFullProps {
  title?: string;
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  className?: string;
}

export function ChatFull({
  title = "Chat",
  placeholder = "Message the AI",
  starterPrompts,
  className,
}: ChatFullProps) {
  return (
    <div className={cn("flex flex-col h-full w-full bg-background", className)}>
      {title && (
        <div className="p-4 border-b h-14 flex items-center shrink-0">
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <Thread placeholder={placeholder} starterPrompts={starterPrompts} />
      </div>
    </div>
  );
}
