import React from "react";
import { UIContract, UIJustify } from "@melony/ui-kit";
import { Button as ButtonBase } from "../ui/button";
import { useMelony } from "@melony/react";
import { cn } from "@/lib/utils";
import { justifyMap } from "@/lib/theme-utils";

export const Button: React.FC<
  UIContract["button"] & { justify?: UIJustify }
> = ({
  type = "button",
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  width,
  onClickAction,
  justify = "center",
}) => {
  const { sendEvent } = useMelony();

  const variantMap: Record<
    string,
    "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  > = {
    primary: "default",
    secondary: "secondary",
    danger: "destructive",
    success: "default", // We might want a custom success style later
    outline: "outline",
    ghost: "ghost",
    link: "link",
  };

  const widthMap: Record<string, string> = {
    full: "w-full",
    auto: "w-auto",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
    "2/3": "w-2/3",
    "1/4": "w-1/4",
    "3/4": "w-3/4",
  };

  return (
    <ButtonBase
      type={type}
      variant={variantMap[variant] || "default"}
      size={size === "md" ? "default" : (size as any)}
      disabled={disabled}
      className={cn(width && widthMap[width], justifyMap[justify])}
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
