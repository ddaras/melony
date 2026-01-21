import React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../providers/sidebar-provider";
import { UIWidth } from "../ui-contract";
import { widthMap } from "@/lib/theme-utils";

export interface SidebarProps {
  side: "left" | "right";
  children: React.ReactNode;
  width?: UIWidth | string;
}

/**
 * A sidebar component that responds to ChatSidebarContext.
 * Typically used within ChatFull or a layout with ChatSidebarProvider.
 */
export function Sidebar({ side, children, width = "1/4" }: SidebarProps) {
  const { leftCollapsed, rightCollapsed } = useSidebar();
  const collapsed = side === "left" ? leftCollapsed : rightCollapsed;

  const widthClass = widthMap[width as UIWidth];

  return (
    <div
      className={cn(
        "flex-shrink-0 border-border bg-background transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
        side === "left" ? "border-r" : "border-l",
        collapsed ? "w-0 border-r-0 border-l-0 min-w-0" : "",
        !collapsed && widthClass,
      )}
      style={!collapsed && !widthClass ? { width } : undefined}
    >
      <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
        {children}
      </div>
    </div>
  );
}
