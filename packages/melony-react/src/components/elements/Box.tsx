import React from "react";
import { BoxProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Box: React.FC<BoxProps> = ({
  children,
  padding = "md",
  margin,
  background,
  border = false,
  borderRadius,
  width,
  height,
  overflow = "visible",
  className,
  style,
}) => {
  const paddingClasses: Record<string, string> = {
    xs: "p-1",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const overflowClasses = {
    auto: "overflow-auto",
    hidden: "overflow-hidden",
    scroll: "overflow-scroll",
    visible: "overflow-visible",
  };

  return (
    <div
      className={cn(
        paddingClasses[padding as keyof typeof paddingClasses] || "p-4",
        border && "border rounded-md",
        overflowClasses[overflow as keyof typeof overflowClasses],
        className
      )}
      style={{
        margin: margin,
        background: background ?? undefined,
        borderRadius: borderRadius,
        width: width,
        height: height,
        ...style,
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};
