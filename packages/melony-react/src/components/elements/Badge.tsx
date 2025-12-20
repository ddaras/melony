import React from "react";
import { Badge as BadgeBase } from "../ui/badge";
import { BadgeProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  className,
  style,
}) => {
  const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    primary: "default",
    secondary: "secondary",
    danger: "destructive",
    success: "default", // Mapping success to default/primary
    warning: "secondary", // Mapping warning to secondary
  };

  return (
    <BadgeBase
      variant={variantMap[variant as keyof typeof variantMap] || "default"}
      className={className}
      style={style}
    >
      {label}
    </BadgeBase>
  );
};
