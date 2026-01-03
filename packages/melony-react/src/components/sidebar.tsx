import React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../providers/sidebar-provider";

export interface SidebarProps {
  side: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

/**
 * A sidebar component that responds to ChatSidebarContext.
 * Typically used within ChatFull or a layout with ChatSidebarProvider.
 */
export function Sidebar({ side, children, className }: SidebarProps) {
  const { leftCollapsed, rightCollapsed } = useSidebar();
  const collapsed = side === "left" ? leftCollapsed : rightCollapsed;

  return (
    <div
      className={cn(
        "flex-shrink-0 border-border bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
        side === "left" ? "border-r" : "border-l",
        collapsed ? "w-0 border-r-0 border-l-0 min-w-0" : "",
        !collapsed && className
      )}
    >
      <div className="flex-1 overflow-hidden min-h-0">{children}</div>
    </div>
  );
}

