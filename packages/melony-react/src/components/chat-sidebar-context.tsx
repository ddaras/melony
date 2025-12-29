import React, { createContext, useContext } from "react";

export interface ChatSidebarContextValue {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  setLeftCollapsed: (collapsed: boolean) => void;
  setRightCollapsed: (collapsed: boolean) => void;
  leftCollapsible: boolean;
  rightCollapsible: boolean;
}

export const ChatSidebarContext = createContext<ChatSidebarContextValue | undefined>(
  undefined
);

export function useChatSidebar() {
  const context = useContext(ChatSidebarContext);
  if (context === undefined) {
    throw new Error("useChatSidebar must be used within a ChatSidebarProvider");
  }
  return context;
}

