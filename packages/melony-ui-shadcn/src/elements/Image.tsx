import React from "react";
import { UIContract, UIWidth, UIRadius } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import { widthMap, radiusMap } from "../lib/theme-utils";

export const Image: React.FC<UIContract["image"]> = ({
  src,
  alt,
  width = "auto",
  height,
  radius = "none",
  objectFit = "cover",
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden",
        typeof width === "string" && widthMap[width as UIWidth],
        radiusMap[radius as UIRadius],
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : undefined,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "block w-full",
          height ? "h-full" : "h-auto",
          objectFit === "cover"
            ? "object-cover"
            : objectFit === "contain"
              ? "object-contain"
              : "object-fill",
        )}
      />
    </div>
  );
};
