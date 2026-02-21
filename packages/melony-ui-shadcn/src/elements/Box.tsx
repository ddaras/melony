import React from "react";
import { UIContract, UIColor, UIWidth, UISpacing, UIRadius, UIShadow } from "@melony/ui-kit";
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
  resolveUIStyle,
} from "../lib/theme-utils";
import { useMelony } from "@melony/react";

export const Box: React.FC<
  UIContract["box"] & { children?: React.ReactNode }
> = (props) => {
  const {
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
    flex = undefined,
    overflow = "hidden",
    onClickAction,
    maxWidth
  } = props;

  const { send } = useMelony();

  const [baseBgColor] = (background || "").split("/");
  const [baseBorderColor] = (borderColor || "").split("/");

  const dynamicStyles = {
    ...resolveUIStyle("backgroundColor", background),
    ...resolveUIStyle("borderColor", borderColor),
  };

  const isInteractive = !!onClickAction;

  const handleClick = () => {
    if (onClickAction) {
      send(onClickAction as any);
    }
  };

  return (
    <div
      className={cn(
        "relative",
        paddingVertical && paddingVerticalMap[paddingVertical as UISpacing],
        paddingHorizontal && paddingHorizontalMap[paddingHorizontal as UISpacing],
        padding && paddingMap[padding as UISpacing],
        marginVertical && marginVerticalMap[marginVertical as UISpacing],
        marginHorizontal && marginHorizontalMap[marginHorizontal as UISpacing],
        margin && marginMap[margin as UISpacing],
        baseBgColor && colorBgMap[baseBgColor as UIColor],
        border && "border",
        baseBorderColor && colorBorderMap[baseBorderColor as UIColor],
        radiusMap[radius as UIRadius],
        widthMap[width as UIWidth],
        height === "full" && "h-full",
        shadowMap[shadow as UIShadow],
        group && "group",
        isInteractive && "cursor-pointer"
      )}
      style={{
        ...dynamicStyles,
        flex,
        width: width && typeof width === "number" ? `${width}px` : width,
        overflow,
        maxWidth: maxWidth && typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      }}
      onClick={isInteractive ? handleClick : undefined}
    >
      {children as React.ReactNode}
    </div>
  );
};
