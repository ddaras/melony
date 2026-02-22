import React from "react";
import { UIContract } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import {
  paddingMap,
  marginMap,
  colorBgMap,
  colorBorderMap,
  radiusMap,
  widthMap,
  shadowMap,
  resolveUIStyle,
} from "../lib/theme-utils";
import { useMelony } from "@melony/react";

export const Box: React.FC<
  UIContract["box"] & { children?: React.ReactNode }
> = ({
  children,
  padding,
  margin,
  background,
  border = false,
  borderColor = "border",
  radius = "none",
  width = "auto",
  height = "auto",
  shadow = "none",
  group = false,
  flex,
  overflow = "visible",
  onClickAction,
  maxWidth,
}) => {
  const { send } = useMelony();

  const [baseBgColor] = (background || "").split("/");
  const [baseBorderColor] = (borderColor || "").split("/");

  const isInteractive = !!onClickAction;

  return (
    <div
      className={cn(
        "relative",
        padding && paddingMap[padding],
        margin && marginMap[margin],
        baseBgColor && colorBgMap[baseBgColor],
        border && "border",
        border && baseBorderColor && colorBorderMap[baseBorderColor],
        radiusMap[radius],
        widthMap[width],
        height === "full" && "h-full",
        shadowMap[shadow],
        group && "group",
        isInteractive && "cursor-pointer",
      )}
      style={{
        ...resolveUIStyle("backgroundColor", background),
        ...resolveUIStyle("borderColor", borderColor),
        flex,
        width: typeof width === "number" ? `${width}px` : undefined,
        overflow,
        maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      }}
      onClick={isInteractive ? () => send(onClickAction as any) : undefined}
    >
      {children}
    </div>
  );
};
