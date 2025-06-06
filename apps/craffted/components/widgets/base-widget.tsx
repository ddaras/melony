"use client";

import { vstack, hstack } from "melony";
import { MoreVertical, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BaseWidgetProps {
  children: React.ReactNode;
  onRemove?: () => void;
  onSettings?: () => void;
  className?: string;
  id: string;
}

export function BaseWidget({
  children,
  onRemove,
  onSettings,
  className = "",
}: BaseWidgetProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={cn("p-[10px] w-full h-full", className)}>
      {vstack({
        className: cn(
          "relative group bg-white/10 backdrop-blur-sm border rounded-lg p-4 shadow-lg items-center justify-center w-full h-full",
          className
        ),
        children: [
          children,
          hstack({
            className: `absolute top-2 right-2 gap-1 transition-opacity duration-200 ${
              showActions ? "opacity-100" : "opacity-0 group-hover:opacity-60"
            }`,
            children: [
              <div
                key="settings"
                className="h-6 w-6 p-0 flex items-center justify-center cursor-pointer hover:bg-muted/20 rounded-sm"
                onClick={onSettings}
              >
                <MoreVertical className="h-4 w-4" />
              </div>,
              <div
                key="remove"
                className="h-6 w-6 p-0 flex items-center justify-center cursor-pointer hover:bg-muted/20 rounded-sm"
                onClick={onRemove}
              >
                <X className="h-4 w-4" />
              </div>,
            ],
          }),
        ],
      })}
    </div>
  );
}
