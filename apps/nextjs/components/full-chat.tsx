import { Thread } from "./thread";
import { cn } from "@/lib/utils";
import { StarterPrompt, ComposerOptionGroup } from "@/types";
import { ChatHeader, ChatHeaderProps } from "./chat-header";
import { AggregatedMessage } from "@melony/react";

export interface FullChatProps {
  title?: string;
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  options?: ComposerOptionGroup[];
  messages?: AggregatedMessage[];
  className?: string;
  /**
   * Props for customizing the header. If provided, title prop will be passed to header.
   */
  headerProps?: Omit<ChatHeaderProps, "title">;
  /**
   * Whether the composer should be auto focused
   */
  autoFocus?: boolean;
  /**
   * IDs of options to be selected by default
   */
  defaultSelectedIds?: string[];
}

export function FullChat({
  title = "Chat",
  placeholder,
  starterPrompts,
  options,
  messages,
  className,
  headerProps,
  autoFocus = false,
  defaultSelectedIds,
}: FullChatProps) {
  return (
    <div className={cn("flex flex-col h-full w-full bg-background", className)}>
      {title && <ChatHeader title={title} {...headerProps} />}
      <div className="flex-1 overflow-hidden flex relative">
        <div className="flex-1 overflow-hidden min-w-0">
          <Thread
            placeholder={placeholder}
            starterPrompts={starterPrompts}
            options={options}
            messages={messages}
            autoFocus={autoFocus}
            defaultSelectedIds={defaultSelectedIds}
          />
        </div>
      </div>
    </div>
  );
}
