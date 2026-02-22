import React from "react";
import { UIContract } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import { spacingMap } from "../lib/theme-utils";

const positionClasses: Record<string, string> = {
  "top-left": "top-1 left-1",
  "top-right": "top-1 right-1",
  "top-center": "top-1 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-1 left-1",
  "bottom-right": "bottom-1 right-1",
  "bottom-center": "bottom-1 left-1/2 -translate-x-1/2",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "left-center": "top-1/2 left-1 -translate-y-1/2",
  "right-center": "top-1/2 right-1 -translate-y-1/2",
};

export const Float: React.FC<
  UIContract["float"] & { children?: React.ReactNode }
> = ({
  children,
  position = "top-right",
  offsetX = "none",
  offsetY = "none",
  showOnHover = false,
}) => {
  const xSide = position.endsWith("left") ? "ml" : "mr";
  const ySide = position.startsWith("top") ? "mt" : "mb";

  return (
    <div
      className={cn(
        "absolute z-10",
        positionClasses[position],
        `${xSide}-${spacingMap[offsetX]}`,
        `${ySide}-${spacingMap[offsetY]}`,
        showOnHover && "opacity-0 group-hover:opacity-100 transition-opacity",
      )}
    >
      {children}
    </div>
  );
};
