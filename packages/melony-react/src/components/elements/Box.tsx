import React from "react";
import { UIContract } from "melony";
import { cn } from "@/lib/utils";
import { 
  paddingMap, 
  marginMap, 
  colorBgMap, 
  colorBorderMap, 
  radiusMap, 
  widthMap, 
  shadowMap 
} from "@/lib/theme-utils";

export const Box: React.FC<UIContract["box"] & { children?: React.ReactNode | React.ReactNode[] }> = ({
  children,
  padding = "none",
  margin = "none",
  background,
  border = false,
  borderColor = "border",
  radius = "none",
  width = "auto",
  height = "auto",
  shadow = "none",
}) => {
  return (
    <div
      className={cn(
        "relative",
        paddingMap[padding],
        marginMap[margin],
        background && colorBgMap[background],
        border && "border",
        border && colorBorderMap[borderColor],
        radiusMap[radius],
        widthMap[width],
        height === "full" && "h-full",
        shadowMap[shadow]
      )}
    >
      {children as React.ReactNode}
    </div>
  );
};
