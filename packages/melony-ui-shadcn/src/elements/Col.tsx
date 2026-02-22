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

export const Col: React.FC<
  UIContract["col"] & { children?: React.ReactNode }
> = ({
  children,
  align = "start",
  justify = "start",
  wrap,
  gap = "none",
  width = "auto",
  height = "auto",
  padding = "none",
  background,
  border = false,
  borderColor = "border",
  radius,
  shadow,
  flex,
  overflow = "visible",
  maxWidth,
  group = false,
}) => {
  const [baseBgColor] = (background || "").split("/");
  const [baseBorderColor] = (borderColor || "").split("/");

  return (
    <div
      className={cn(
        "flex flex-col min-w-0",
        alignMap[align],
        justifyMap[justify],
        wrap && wrapMap[wrap],
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
