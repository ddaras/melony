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
  paddingVerticalMap,
  paddingHorizontalMap,
  marginVerticalMap,
  marginHorizontalMap,
} from "../lib/theme-utils";

export const Box: React.FC<
  UIContract["box"] & { children?: React.ReactNode }
> = ({
  children,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  background,
  border = false,
  borderColor = "border",
  radius = "none",
  width = "auto",
  height = "auto",
  shadow = "none",
  group = false,
}) => {
    return (
      <div
        className={cn(
          "relative",
          paddingVertical && paddingVerticalMap[paddingVertical],
          paddingHorizontal && paddingHorizontalMap[paddingHorizontal],
          padding && paddingMap[padding],
          marginVertical && marginVerticalMap[marginVertical],
          marginHorizontal && marginHorizontalMap[marginHorizontal],
          margin && marginMap[margin],
          background && colorBgMap[background],
          border && "border",
          border && colorBorderMap[borderColor],
          radiusMap[radius],
          widthMap[width],
          height === "full" && "h-full",
          shadowMap[shadow],
          group && "group",
        )}
        style={{ width: width && typeof width === "number" ? `${width}px` : undefined }}
      >
        {children as React.ReactNode}
      </div>
    );
  };
