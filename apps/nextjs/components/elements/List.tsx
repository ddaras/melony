import React from "react";
import { UIContract } from "../../ui-contract";
import { cn } from "@/lib/utils";
import { paddingMap, gapMap } from "@/lib/theme-utils";

export const List: React.FC<
  UIContract["list"] & {
    children?: React.ReactNode;
    flex?: string;
    overflow?: string;
  }
> = ({ children, padding = "none", gap = "none", flex, overflow }) => {
  return (
    <div
      className={cn(
        "flex flex-col list-none m-0",
        paddingMap[padding],
        gapMap[gap],
      )}
      style={{ flex, overflow }}
    >
      {children as React.ReactNode}
    </div>
  );
};
