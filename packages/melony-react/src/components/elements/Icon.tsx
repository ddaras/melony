import React from "react";
import { UIContract } from "melony";
import * as ICONS from "@tabler/icons-react";
import { colorTextMap } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";

export const Icon: React.FC<UIContract["icon"]> = ({
  name,
  size = "md",
  color = "foreground",
}) => {
  const IconComponent = ICONS[name as keyof typeof ICONS];

  if (!IconComponent) return null;

  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const resolvedSize =
    typeof size === "number"
      ? size
      : sizeMap[size as keyof typeof sizeMap] || 20;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        colorTextMap[color],
      )}
    >
      <IconComponent size={resolvedSize} strokeWidth={1.5} />
    </div>
  );
};
