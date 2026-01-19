import React from "react";
import { UIContract } from "melony";
import { cn } from "@/lib/utils";
import {
  alignMap,
  justifyMap,
  gapMap,
  paddingMap,
  widthMap,
  wrapMap,
} from "@/lib/theme-utils";

export const Row: React.FC<
  UIContract["row"] & { children?: React.ReactNode[] }
> = ({
  children,
  align = "start",
  justify = "start",
  wrap = "nowrap",
  gap = "none",
  padding = "none",
  width = "full",
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
      )}
    >
      {children as React.ReactNode}
    </div>
  );
};

// Add missing maps to theme-utils
