import React from "react";
import { UIContract } from "@melony/ui-kit";
import * as ICONS from "@tabler/icons-react";
import { colorTextMap } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";

export const Icon: React.FC<UIContract["icon"] & { className?: string }> = ({
  name,
  size = "md",
  color,
  className,
}) => {
  const IconComponent = ICONS[name as keyof typeof ICONS] as React.ElementType;

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
        color && colorTextMap[color],
        className
      )}
    >
      <IconComponent size={resolvedSize} strokeWidth={1.5} />
    </div>
  );
};
