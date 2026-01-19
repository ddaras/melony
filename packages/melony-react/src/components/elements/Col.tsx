import React from "react";
import { UIContract } from "melony";
import { cn } from "@/lib/utils";
import { alignMap, justifyMap, gapMap, paddingMap, widthMap, colorBgMap, radiusMap } from "@/lib/theme-utils";

export const Col: React.FC<UIContract["col"] & { children?: React.ReactNode | React.ReactNode[] }> = ({
  children,
  align = "start",
  justify = "start",
  gap = "none",
  width = "auto",
  height = "auto",
  padding = "none",
  background,
  radius,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col",
        alignMap[align],
        justifyMap[justify],
        gapMap[gap],
        paddingMap[padding],
        widthMap[width],
        height === "full" && "h-full",
        background && colorBgMap[background],
        radius && radiusMap[radius]
      )}
    >
      {children as React.ReactNode}
    </div>
  );
};
