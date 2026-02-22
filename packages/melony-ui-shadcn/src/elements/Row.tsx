import React from "react";
import { UIContract } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import {
  alignMap,
  justifyMap,
  wrapMap,
  gapMap,
  paddingMap,
  widthMap,
  colorBgMap,
  colorBorderMap,
  radiusMap,
  shadowMap,
  resolveUIStyle,
} from "../lib/theme-utils";

export const Row: React.FC<
  UIContract["row"] & { children?: React.ReactNode }
> = ({
  children,
  align = "start",
  justify = "start",
  wrap = "nowrap",
  gap = "none",
  padding = "none",
  width = "full",
  height = "auto",
  flex,
  overflow = "visible",
  background,
  border = false,
  borderColor = "border",
  radius,
  shadow,
  maxWidth,
  group = false,
}) => {
  const [baseBgColor] = (background || "").split("/");
  const [baseBorderColor] = (borderColor || "").split("/");

  return (
    <div
      className={cn(
        "flex flex-row min-w-0",
        alignMap[align],
        justifyMap[justify],
        wrapMap[wrap],
        gapMap[gap],
        paddingMap[padding],
        widthMap[width],
        height === "full" && "h-full",
        baseBgColor && colorBgMap[baseBgColor],
        border && "border",
        border && baseBorderColor && colorBorderMap[baseBorderColor],
        radius && radiusMap[radius],
        shadow && shadowMap[shadow],
        group && "group",
      )}
      style={{
        ...resolveUIStyle("backgroundColor", background),
        ...resolveUIStyle("borderColor", borderColor),
        flex,
        width: typeof width === "number" ? `${width}px` : undefined,
        overflow,
        maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      }}
    >
      {children}
    </div>
  );
};
