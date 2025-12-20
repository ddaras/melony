import React from "react";
import * as ICONS from "@tabler/icons-react";
import { IconProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Icon: React.FC<IconProps> = ({
  name,
  size,
  color,
  className,
  style,
}) => {
  const IconComponent = ICONS[name as keyof typeof ICONS];

  if (!IconComponent) return null;

  const sizeMap = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
  };

  const resolvedSize =
    typeof size === "string" && size in sizeMap
      ? sizeMap[size as keyof typeof sizeMap]
      : typeof size === "number"
        ? size
        : 20;

  return (
    <div
      className={cn("inline-flex items-center justify-center", className)}
      style={style}
    >
      <IconComponent
        size={resolvedSize}
        color={color || "currentColor"}
        strokeWidth={1.5}
      />
    </div>
  );
};
