import React from "react";
import { UIContract } from "@melony/ui-kit";
import { cn } from "@/lib/utils";
import { paddingMap } from "@/lib/theme-utils";

export const Spacer: React.FC<UIContract["spacer"]> = ({
  size = "md",
  direction = "vertical",
}) => {
  return (
    <div
      className={cn(
        direction === "vertical" ? "w-full" : "h-full",
        paddingMap[size],
      )}
    />
  );
};
