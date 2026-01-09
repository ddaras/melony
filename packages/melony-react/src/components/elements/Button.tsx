import React from "react";
import { Button as ButtonBase } from "../ui/button";
import { ButtonProps } from "./component-types";
import { useMelony } from "@/hooks/use-melony";
import { cn } from "@/lib/utils";

export const Button: React.FC<ButtonProps> = ({
  type,
  label,
  variant = "primary",
  size = "default",
  disabled = false,
  fullWidth = false,
  onClickAction,
  className,
  style,
}) => {
  const { sendEvent } = useMelony();

  const variantMap: Record<
    string,
    "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  > = {
    primary: "default",
    secondary: "secondary",
    danger: "destructive",
    outline: "outline",
    ghost: "ghost",
    link: "link",
    success: "default", // Success doesn't have a direct shadcn mapping in base variant, default is usually primary
  };

  return (
    <ButtonBase
      type={type}
      variant={variantMap[variant as keyof typeof variantMap] || "default"}
      size={size === "md" ? "default" : (size as any)}
      disabled={disabled}
      className={cn(fullWidth ? "w-full" : undefined, className)}
      style={style}
      onClick={() => {
        if (onClickAction) {
          sendEvent(onClickAction as any);
        }
      }}
    >
      {label}
    </ButtonBase>
  );
};
