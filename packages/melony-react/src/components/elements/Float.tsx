import React from "react";
import { UIContract } from "melony";
import { cn } from "@/lib/utils";
import { marginMap } from "@/lib/theme-utils";

export const Float: React.FC<UIContract["float"] & { children?: React.ReactNode | React.ReactNode[] }> = ({
  children,
  position = "top-right",
  offsetX = "none",
  offsetY = "none",
  showOnHover = false,
}) => {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  const marginXClass = position.endsWith("left") ? marginMap[offsetX].replace("m-", "ml-") : marginMap[offsetX].replace("m-", "mr-");
  const marginYClass = position.startsWith("top") ? marginMap[offsetY].replace("m-", "mt-") : marginMap[offsetY].replace("m-", "mb-");

  return (
    <div
      className={cn(
        "absolute z-10",
        positionClasses[position],
        marginXClass,
        marginYClass,
        showOnHover && "opacity-0 group-hover:opacity-100 transition-opacity"
      )}>

      {children}
    </div> 
  ); 
}; 