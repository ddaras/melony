import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Thread } from "./thread";
import { cn } from "@/lib/utils";
import { StarterPrompt, ComposerOptionGroup } from "@/types";
import { ChatHeader, ChatHeaderProps } from "./chat-header";
import { ChatSidebarContext } from "./chat-sidebar-context";
import { useScreenSize } from "@/hooks/use-screen-size";

export interface ChatFullProps {
  title?: string;
  placeholder?: string;
  starterPrompts?: StarterPrompt[];
  options?: ComposerOptionGroup[];
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
   * Whether the composer should be auto focused
   */
  autoFocus?: boolean;
  /**
   * IDs of options to be selected by default
   */
  defaultSelectedIds?: string[];
}

export function ChatFull({
  title = "Chat",
  placeholder = "Message the AI",
  starterPrompts,
  options,
  className,
  headerProps,
  leftSidebar,
  rightSidebar,
  leftSidebarClassName,
  rightSidebarClassName,
  autoFocus = false,
  defaultSelectedIds,
}: ChatFullProps) {
  // Screen size detection
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;

  // Internal state for uncontrolled mode
  const [internalLeftCollapsed, setInternalLeftCollapsed] = useState(() => {
    // Initialize collapsed on small screens
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [internalRightCollapsed, setInternalRightCollapsed] = useState(() => {
    // Initialize collapsed on small screens
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Auto-collapse sidebars when transitioning to mobile/tablet devices
  useEffect(() => {
    if (isSmallScreen) {
      setInternalLeftCollapsed(true);
      setInternalRightCollapsed(true);
    }
  }, [isSmallScreen]);

  // Use controlled state if provided, otherwise use internal state
  const leftCollapsed = internalLeftCollapsed;
  const rightCollapsed = internalRightCollapsed;

  const handleLeftToggle = useCallback((collapsed: boolean) => {
    setInternalLeftCollapsed(collapsed);
  }, []);

  const handleRightToggle = useCallback((collapsed: boolean) => {
    setInternalRightCollapsed(collapsed);
  }, []);

  const contextValue = useMemo(
    () => ({
      leftCollapsed,
      rightCollapsed,
      setLeftCollapsed: handleLeftToggle,
      setRightCollapsed: handleRightToggle,
      leftCollapsible: true,
      rightCollapsible: true,
    }),
    [leftCollapsed, rightCollapsed, handleLeftToggle, handleRightToggle]
  );

  return (
    <ChatSidebarContext.Provider value={contextValue}>
      <div
        className={cn("flex flex-col h-full w-full bg-background", className)}
      >
        {title && <ChatHeader title={title} {...headerProps} />}
        <div className="flex-1 overflow-hidden flex relative">
          {leftSidebar && (
            <div
              className={cn(
                "flex-shrink-0 border-r border-border bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
                leftCollapsed ? "w-0 border-r-0 min-w-0" : "",
                !leftCollapsed && leftSidebarClassName
              )}
            >
              <div className="flex-1 overflow-hidden min-h-0">
                {leftSidebar}
              </div>
            </div>
          )}
          <div className="flex-1 overflow-hidden min-w-0">
            <Thread
              placeholder={placeholder}
              starterPrompts={starterPrompts}
              options={options}
              autoFocus={autoFocus}
              defaultSelectedIds={defaultSelectedIds}
            />
          </div>
          {rightSidebar && (
            <div
              className={cn(
                "flex-shrink-0 border-l border-border bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
                rightCollapsed ? "w-0 border-l-0 min-w-0" : "",
                !rightCollapsed && rightSidebarClassName
              )}
            >
              <div className="flex-1 overflow-hidden min-h-0">
                {rightSidebar}
              </div>
            </div>
          )}
        </div>
      </div>
    </ChatSidebarContext.Provider>
  );
}
