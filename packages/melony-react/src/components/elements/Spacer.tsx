import React from "react";
import { SpacerProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Spacer: React.FC<SpacerProps> = ({
  size = "md",
  direction = "vertical",
  className,
  style,
}) => {
  const sizeClasses: Record<string, string> = {
    xs: "p-0.5",
    sm: "p-1",
    md: "p-2",
    lg: "p-4",
    xl: "p-8",
  };

  return (
    <div
      className={cn(
        direction === "vertical" ? "w-full" : "h-full",
        sizeClasses[size as keyof typeof sizeClasses] || "p-2",
        className
      )}
      style={style}
    />
  );
};
