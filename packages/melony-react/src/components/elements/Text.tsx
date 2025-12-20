import React from "react";
import { cn } from "@/lib/utils";
import { TextProps } from "./component-types";

export const Text: React.FC<TextProps> = ({
  value,
  size = "md",
  weight = "normal",
  align = "start",
  className,
  style,
}) => {
  const sizeClasses: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const weightClasses: Record<string, string> = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const alignClasses: Record<string, string> = {
    start: "text-left",
    center: "text-center",
    end: "text-right",
    stretch: "text-justify",
  };

  return (
    <span
      className={cn(
        sizeClasses[size as keyof typeof sizeClasses] || "text-base",
        weightClasses[weight as keyof typeof weightClasses] || "font-normal",
        alignClasses[align as keyof typeof alignClasses] || "text-left",
        className
      )}
      style={style}
    >
      {value}
    </span>
  );
};
