import React from "react";
import { ColProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Col: React.FC<ColProps> = ({
  children,
  gap = "sm",
  align = "start",
  justify = "start",
  wrap = "nowrap",
  flex = 1,
  width,
  height,
  padding,
  overflow,
  position = "static",
  className,
  style,
}) => {
  const gapClasses: Record<string, string> = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
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

  // Automatically add scrollable className for auto/scroll overflow
  const overflowClasses = {
    auto: "overflow-auto",
    hidden: "overflow-hidden",
    scroll: "overflow-scroll",
    visible: "overflow-visible",
  };

  const positionClasses = {
    static: "static",
    relative: "relative",
    absolute: "absolute",
    fixed: "fixed",
    sticky: "sticky",
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        gapClasses[gap as keyof typeof gapClasses] || "gap-2",
        alignClasses[align as keyof typeof alignClasses] || "items-start",
        justifyClasses[justify as keyof typeof justifyClasses] || "justify-start",
        wrap === "wrap" ? "flex-wrap" : "flex-nowrap",
        overflow && (overflowClasses[overflow as keyof typeof overflowClasses]),
        position && positionClasses[position as keyof typeof positionClasses],
        className
      )}
      style={{
        flex: flex,
        width: width,
        height: height,
        padding: padding,
        ...style,
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};
