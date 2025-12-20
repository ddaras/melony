import React from "react";
import { RowProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Row: React.FC<RowProps> = ({
  children,
  gap = "md",
  align = "start",
  justify = "start",
  wrap = false,
  className,
  style,
}) => {
  const gapClasses: Record<string, string> = {
    xs: "gap-0",
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-4",
    xl: "gap-6",
  };

  const alignClasses: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  return (
    <div
      className={cn(
        "flex flex-row w-full",
        gapClasses[gap as keyof typeof gapClasses] || "gap-4",
        alignClasses[align as keyof typeof alignClasses] || "items-start",
        justifyClasses[justify as keyof typeof justifyClasses] || "justify-start",
        wrap ? "flex-wrap" : "flex-nowrap",
        className
      )}
      style={style}
    >
      {children as React.ReactNode}
    </div>
  );
};
