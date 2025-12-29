import React from "react";
import { cn } from "@/lib/utils";

export interface ChatHeaderProps {
  /**
   * The title to display in the header. Can be a string or a React node for custom content.
   */
  title?: string | React.ReactNode;

  /**
   * Content to render on the left side of the header (e.g., back button).
   */
  leftContent?: React.ReactNode;

  /**
   * Content to render on the right side of the header (e.g., action buttons).
   */
  rightContent?: React.ReactNode;

  /**
   * Custom className for the header container.
   */
  className?: string;

  /**
   * Custom className for the title element (only applies when title is a string).
   */
  titleClassName?: string;

  /**
   * Custom children to render inside the header. If provided, this takes precedence over title/leftContent/rightContent.
   */
  children?: React.ReactNode;
}

/**
 * A shared, customizable header component for chat interfaces.
 * Used consistently across ChatFull, ChatSidebar, and ChatPopup components.
 */
export function ChatHeader({
  leftContent,
  rightContent,
  className,
  children,
}: ChatHeaderProps) {
  // If children are provided, use them for complete customization
  if (children) {
    return (
      <div
        className={cn(
          "px-2 border-b border-border h-14 flex items-center shrink-0",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "px-2 border-b border-border h-14 flex items-center justify-between shrink-0",
        className
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {leftContent}
      </div>
      {rightContent && (
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {rightContent}
        </div>
      )}
    </div>
  );
}
