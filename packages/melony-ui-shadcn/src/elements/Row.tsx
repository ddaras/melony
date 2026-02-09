import React from "react";
import { UIContract, UIAlign, UIJustify, UIWrap, UISpacing, UIWidth } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import {
  alignMap,
  justifyMap,
  gapMap,
  paddingMap,
  widthMap,
  wrapMap,
} from "../lib/theme-utils";

export const Row: React.FC<
  UIContract["row"] & { children?: React.ReactNode }
> = (props) => {
  const {
    children,
    align = "start",
    justify = "start",
    wrap = "nowrap",
    gap = "none",
    padding = "none",
    width = "full",
    height = "auto",
    flex = undefined,
    overflow = "hidden",
  } = props;
  return (
    <div
      className={cn(
        "flex flex-row",
        alignMap[align as UIAlign],
        justifyMap[justify as UIJustify],
        wrapMap[wrap as UIWrap],
        gapMap[gap as UISpacing],
        paddingMap[padding as UISpacing],
        widthMap[width as UIWidth],
        height === "full" && "h-full",
      )}
      style={{ flex, width: width && typeof width === "number" ? `${width}px` : undefined, overflow }}
    >
      {children as React.ReactNode}
    </div>
  );
};

// Add missing maps to theme-utils
