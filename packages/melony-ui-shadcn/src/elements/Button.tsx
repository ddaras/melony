import React, { useLayoutEffect, useRef, useState } from "react";
import { UIContract } from "@melony/ui-kit";
import { Button as ButtonBase } from "../ui/button";
import { useMelony } from "@melony/react";
import { cn } from "../lib/utils";
import { justifyMap, widthMap } from "../lib/theme-utils";

export const Button: React.FC<
  UIContract["button"] & { children?: React.ReactNode }
> = (props) => {
  const {
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    width,
    onClickAction,
    justify = "center",
    truncate = true,
    children,
  } = props;
  const { send } = useMelony();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    if (!truncate) {
      setIsOverflowing(false);
      return;
    }

    const checkOverflow = () => {
      const el = buttonRef.current;
      if (el) {
        setIsOverflowing(el.scrollWidth > el.clientWidth);
      }
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => observer.disconnect();
  }, [children, truncate]);

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
      ref={buttonRef}
      type={type}
      variant={variantMap[variant] || "default"}
      size={size === "md" ? "default" : (size as any)}
      disabled={disabled}
      className={cn(
        width && widthMap[width],
        justifyMap[justify],
        truncate && "overflow-hidden whitespace-nowrap",
        truncate && isOverflowing && "mask-fade-out",
      )}
      onClick={() => {
        if (onClickAction) {
          send(onClickAction as any);
        }
      }}
      style={{
        width: width && typeof width === "number" ? `${width}px` : undefined,
      }}
    >
      {children}
    </ButtonBase>
  );
};
