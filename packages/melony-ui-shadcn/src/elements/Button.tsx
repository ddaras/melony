import React from "react";
import { UIContract, UIJustify } from "@melony/ui-kit";
import { Button as ButtonBase } from "../ui/button";
import { useMelony } from "@melony/react";
import { cn } from "../lib/utils";
import { justifyMap } from "../lib/theme-utils";
import { widthMap } from "./helpers";

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
    const { send } = useMelony();

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

    return (
      <ButtonBase
        type={type}
        variant={variantMap[variant] || "default"}
        size={size === "md" ? "default" : (size as any)}
        disabled={disabled}
        className={cn(width && widthMap[width], justifyMap[justify])}
        onClick={() => {
          if (onClickAction) {
            send(onClickAction as any);
          }
        }}
        style={{ width: width && typeof width === "number" ? `${width}px` : undefined }}
      >
        {label}
      </ButtonBase>
    );
  };
