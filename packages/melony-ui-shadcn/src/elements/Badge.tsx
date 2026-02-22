import React from "react";
import { UIContract } from "@melony/ui-kit";
import { Badge as BadgeBase } from "../ui/badge";

export const Badge: React.FC<UIContract["badge"]> = ({
  label,
  variant = "primary",
  size = "md",
}) => {
  const variantMap: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    primary: "default",
    secondary: "secondary",
    danger: "destructive",
    success: "default",
    warning: "secondary",
    outline: "outline",
  };

  const sizeClasses: Record<string, string> = {
    xs: "text-[10px] px-1 py-0",
    sm: "text-[10px] px-1.5 py-0",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
    xl: "text-sm px-4 py-1.5",
  };

  return (
    <BadgeBase
      variant={variantMap[variant] || "default"}
      className={sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md}
    >
      {label}
    </BadgeBase>
  );
};
