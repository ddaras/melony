import React from "react";
import { UIContract, UIWidth } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import { paddingMap, gapMap, widthMap } from "../lib/theme-utils";

export const List: React.FC<
  UIContract["list"] & {
    children?: React.ReactNode;
    flex?: string;
    overflow?: string;
  }
> = ({ children, padding = "none", gap = "none", flex, overflow, width }) => {
  return (
    <div
      className={cn(
        "flex flex-col list-none m-0",
        paddingMap[padding],
        gapMap[gap],
        widthMap[width as UIWidth],
      )}
      style={{ flex, overflow, width: width && typeof width === "number" ? `${width}px` : undefined }}
    >
      {children as React.ReactNode}
    </div>
  );
};
