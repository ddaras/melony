import React from "react";
import { UIContract, UIAlign, UIJustify, UISpacing, UIWidth, UIColor, UIRadius } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import {
  alignMap,
  justifyMap,
  gapMap,
  paddingMap,
  widthMap,
  colorBgMap,
  radiusMap,
} from "../lib/theme-utils";

export const Col: React.FC<
  UIContract["col"] & { children?: React.ReactNode }
> = (props) => {
    const {
      children,
      align = "start",
      justify = "start",
      gap = "none",
      width = "auto",
      height = "auto",
      padding = "none",
      background,
      radius,
      flex = undefined,
      overflow = "visible",
      maxWidth,
    } = props;
    return (
      <div
        className={cn(
          "flex flex-col min-w-0",
          alignMap[align as UIAlign],
          justifyMap[justify as UIJustify],
          gapMap[gap as UISpacing],
          paddingMap[padding as UISpacing],
          widthMap[width as UIWidth],
          height === "full" && "h-full",
          background && colorBgMap[background as UIColor],
          radius && radiusMap[radius as UIRadius],
        )}
        style={{ flex, width: width && typeof width === "number" ? `${width}px` : undefined, overflow, maxWidth: maxWidth && typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth }}
      >
        {children as React.ReactNode}
      </div>
    );
  };
