import React from "react";
import { UIContract } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import {
  alignMap,
  justifyMap,
  gapMap,
  paddingMap,
  widthMap,
  wrapMap,
} from "../lib/theme-utils";

export const Row: React.FC<
  UIContract["row"] & { children?: React.ReactNode }
> = ({
  children,
  align = "start",
  justify = "start",
  wrap = "nowrap",
  gap = "none",
  padding = "none",
  width = "full",
  height = "auto",
}) => {
  return (
    <div
      className={cn(
        "flex flex-row",
        alignMap[align],
        justifyMap[justify],
        wrapMap[wrap],
        gapMap[gap],
        paddingMap[padding],
        widthMap[width],
        height === "full" && "h-full",
      )}
      style={{ width: width && typeof width === "number" ? `${width}px` : undefined }}
    >
      {children as React.ReactNode}
    </div>
  );
};

// Add missing maps to theme-utils
