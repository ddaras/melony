import React, { useState } from "react";
import { Thread } from "./thread";
import { cn } from "@/lib/utils";
import { StarterPrompt } from "@/types";
import { ChatHeader, ChatHeaderProps } from "./chat-header";
import { Button } from "./ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export interface ChatFullProps {
  title?: string;
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  className?: string;
  /**
   * Props for customizing the header. If provided, title prop will be passed to header.
   */
  headerProps?: Omit<ChatHeaderProps, "title">;
  /**
   * Customizable left sidebar content. Typically used for navigation, thread list, etc.
   */
  leftSidebar?: React.ReactNode;
  /**
   * Customizable right sidebar content. Typically used as a canvas, additional info, etc.
   */
  rightSidebar?: React.ReactNode;
  /**
   * Custom className for the left sidebar container
   */
  leftSidebarClassName?: string;
  /**
   * Custom className for the right sidebar container
   */
  rightSidebarClassName?: string;
  /**
   * Whether the left sidebar is collapsible
   */
  leftSidebarCollapsible?: boolean;
  /**
   * Whether the right sidebar is collapsible
   */
  rightSidebarCollapsible?: boolean;
  /**
   * Default collapsed state for the left sidebar
   */
  defaultLeftSidebarCollapsed?: boolean;
  /**
   * Default collapsed state for the right sidebar
   */
  defaultRightSidebarCollapsed?: boolean;
  /**
   * Controlled collapsed state for the left sidebar. If provided, component becomes controlled.
   */
  leftSidebarCollapsed?: boolean;
  /**
   * Controlled collapsed state for the right sidebar. If provided, component becomes controlled.
   */
  rightSidebarCollapsed?: boolean;
  /**
   * Callback when left sidebar collapse state changes
   */
  onLeftSidebarCollapseChange?: (collapsed: boolean) => void;
  /**
   * Callback when right sidebar collapse state changes
   */
  onRightSidebarCollapseChange?: (collapsed: boolean) => void;
}

export function ChatFull({
  title = "Chat",
  placeholder = "Message the AI",
  starterPrompts,
  className,
  headerProps,
  leftSidebar,
  rightSidebar,
  leftSidebarClassName,
  rightSidebarClassName,
  leftSidebarCollapsible = false,
  rightSidebarCollapsible = false,
  defaultLeftSidebarCollapsed = false,
  defaultRightSidebarCollapsed = false,
  leftSidebarCollapsed: controlledLeftCollapsed,
  rightSidebarCollapsed: controlledRightCollapsed,
  onLeftSidebarCollapseChange,
  onRightSidebarCollapseChange,
}: ChatFullProps) {
  // Internal state for uncontrolled mode
  const [internalLeftCollapsed, setInternalLeftCollapsed] = useState(
    defaultLeftSidebarCollapsed
  );
  const [internalRightCollapsed, setInternalRightCollapsed] = useState(
    defaultRightSidebarCollapsed
  );

  // Use controlled state if provided, otherwise use internal state
  const leftCollapsed =
    controlledLeftCollapsed !== undefined
      ? controlledLeftCollapsed
      : internalLeftCollapsed;
  const rightCollapsed =
    controlledRightCollapsed !== undefined
      ? controlledRightCollapsed
      : internalRightCollapsed;

  const handleLeftToggle = () => {
    const newCollapsed = !leftCollapsed;
    if (controlledLeftCollapsed === undefined) {
      setInternalLeftCollapsed(newCollapsed);
    }
    onLeftSidebarCollapseChange?.(newCollapsed);
  };

  const handleRightToggle = () => {
    const newCollapsed = !rightCollapsed;
    if (controlledRightCollapsed === undefined) {
      setInternalRightCollapsed(newCollapsed);
    }
    onRightSidebarCollapseChange?.(newCollapsed);
  };

  return (
    <div className={cn("flex flex-col h-full w-full bg-background", className)}>
      {title && <ChatHeader title={title} {...headerProps} />}
      <div className="flex-1 overflow-hidden flex relative">
        {leftSidebar && (
          <>
            <div
              className={cn(
                "flex-shrink-0 border-r border-border bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
                leftCollapsed && leftSidebarCollapsible
                  ? "w-0 border-r-0 min-w-0"
                  : "",
                !leftCollapsed && leftSidebarClassName
              )}
            >
              {!leftCollapsed && (
                <>
                  {leftSidebarCollapsible && (
                    <div className="flex justify-end p-2 border-b border-border shrink-0">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleLeftToggle}
                        aria-label="Collapse left sidebar"
                        className="h-8 w-8"
                      >
                        <IconChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden min-h-0">
                    {leftSidebar}
                  </div>
                </>
              )}
            </div>
            {leftSidebarCollapsible && leftCollapsed && (
              <div className="flex-shrink-0 border-r border-border bg-background flex items-center justify-center w-10">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleLeftToggle}
                  aria-label="Expand left sidebar"
                  className="h-8 w-8"
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
        <div className="flex-1 overflow-hidden min-w-0">
          <Thread placeholder={placeholder} starterPrompts={starterPrompts} />
        </div>
        {rightSidebar && (
          <>
            {rightSidebarCollapsible && rightCollapsed && (
              <div className="flex-shrink-0 border-l border-border bg-background flex items-center justify-center w-10">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleRightToggle}
                  aria-label="Expand right sidebar"
                  className="h-8 w-8"
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div
              className={cn(
                "flex-shrink-0 border-l border-border bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
                rightCollapsed && rightSidebarCollapsible
                  ? "w-0 border-l-0 min-w-0"
                  : "",
                !rightCollapsed && rightSidebarClassName
              )}
            >
              {!rightCollapsed && (
                <>
                  {rightSidebarCollapsible && (
                    <div className="flex justify-start p-2 border-b border-border shrink-0">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleRightToggle}
                        aria-label="Collapse right sidebar"
                        className="h-8 w-8"
                      >
                        <IconChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden min-h-0">
                    {rightSidebar}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
