import React from "react";
import { Thread } from "./thread";
import { cn } from "@/lib/utils";
import { StarterPrompt } from "@/types";
import { ChatHeader, ChatHeaderProps } from "./chat-header";

export interface ChatSidebarProps {
  title?: string;
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  className?: string;
  /**
   * Props for customizing the header. If provided, title prop will be passed to header.
   */
  headerProps?: Omit<ChatHeaderProps, "title">;
}

export function ChatSidebar({
  title = "Chat",
  placeholder = "Message the AI",
  starterPrompts,
  className,
  headerProps,
}: ChatSidebarProps) {
  return (
    <div className={cn("flex flex-col h-full border-r bg-background w-80", className)}>
      <ChatHeader title={title} {...headerProps} />
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

