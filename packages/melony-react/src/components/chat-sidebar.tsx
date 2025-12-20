import React from "react";
import { Thread } from "./thread";
import { cn } from "@/lib/utils";
import { StarterPrompt } from "@/types";

export interface ChatSidebarProps {
  title?: string;
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  className?: string;
}

export function ChatSidebar({
  title = "Chat",
  placeholder = "Message the AI",
  starterPrompts,
  className,
}: ChatSidebarProps) {
  return (
    <div className={cn("flex flex-col h-full border-r bg-background w-80", className)}>
      <div className="p-4 border-b h-14 flex items-center shrink-0">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <Thread 
          placeholder={placeholder} 
          starterPrompts={starterPrompts} 
          className="h-full"
        />
      </div>
    </div>
  );
}

