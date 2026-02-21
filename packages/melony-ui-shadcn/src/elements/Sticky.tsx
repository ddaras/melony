import React from "react";
import { UIContract, UISpacing, UIColor, UIWidth } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import {
  paddingMap,
  colorBgMap,
  spacingMap,
  resolveUIStyle,
  widthMap,
} from "../lib/theme-utils";

export const Sticky: React.FC<
  UIContract["sticky"] & { children?: React.ReactNode }
> = ({
  children,
  top,
  bottom,
  left,
  right,
  zIndex = 10,
  background,
  padding,
  width,
  maxWidth,
}) => {
    const [baseBgColor] = (background || "").split("/");

    const dynamicStyles = {
      ...resolveUIStyle("backgroundColor", background),
      zIndex,
      top: typeof top === "number" ? `${top}px` : (top ? `calc(var(--spacing) * ${spacingMap[top as UISpacing]})` : undefined),
      bottom: typeof bottom === "number" ? `${bottom}px` : (bottom ? `calc(var(--spacing) * ${spacingMap[bottom as UISpacing]})` : undefined),
      left: typeof left === "number" ? `${left}px` : (left ? `calc(var(--spacing) * ${spacingMap[left as UISpacing]})` : undefined),
      right: typeof right === "number" ? `${right}px` : (right ? `calc(var(--spacing) * ${spacingMap[right as UISpacing]})` : undefined),
      maxWidth: maxWidth && typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
    };

    return (
      <div
        className={cn(
          "sticky",
          padding && paddingMap[padding as UISpacing],
          baseBgColor && colorBgMap[baseBgColor as UIColor],
          width && widthMap[width as UIWidth],
        )}
        style={dynamicStyles}
      >
        {children}
      </div>
    );
  };
