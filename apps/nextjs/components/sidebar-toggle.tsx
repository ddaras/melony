import { Button } from "./ui/button";
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
} from "@tabler/icons-react";
import { useSidebar } from "../providers/sidebar-provider";
import { cn } from "@/lib/utils";

export interface SidebarToggleProps {
  side: "left" | "right";
  className?: string;
}

export function SidebarToggle({ side, className }: SidebarToggleProps) {
  const {
    leftCollapsed,
    rightCollapsed,
    setLeftCollapsed,
    setRightCollapsed,
    leftCollapsible,
    rightCollapsible,
  } = useSidebar();

  if (side === "left") {
    if (!leftCollapsible) return null;
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLeftCollapsed(!leftCollapsed)}
        aria-label={
          leftCollapsed ? "Expand left sidebar" : "Collapse left sidebar"
        }
        className={cn("", className)}
      >
        {leftCollapsed ? (
          <IconLayoutSidebarLeftExpand className="h-4 w-4" />
        ) : (
          <IconLayoutSidebarLeftCollapse className="h-4 w-4" />
        )}
      </Button>
    );
  }

  if (side === "right") {
    if (!rightCollapsible) return null;
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setRightCollapsed(!rightCollapsed)}
        aria-label={
          rightCollapsed ? "Expand right sidebar" : "Collapse right sidebar"
        }
        className={cn("", className)}
      >
        {rightCollapsed ? (
          <IconLayoutSidebarRightExpand className="h-4 w-4" />
        ) : (
          <IconLayoutSidebarRightCollapse className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return null;
}
