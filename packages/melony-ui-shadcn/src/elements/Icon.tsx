import React from "react";
import { UIContract } from "@melony/ui-kit";
import { colorTextMap } from "../lib/theme-utils";
import { cn } from "../lib/utils";
import * as LucideIcons from "lucide-react";

export const Icon: React.FC<UIContract["icon"] & { className?: string }> = (props) => {
  const {
    name,
    size = "md",
    color,
    className,
  } = props;
  const sizeMap = {
    sm: "14px",
    md: "18px",
    lg: "24px",
  };

  const resolvedSize =
    typeof size === "number"
      ? `${size}px`
      : sizeMap[size as keyof typeof sizeMap] || "18px";

  // Check if name is a Lucide icon
  const LucideIcon = (LucideIcons as any)[name];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center leading-none",
        color && colorTextMap[color],
        className
      )}
      style={{ 
        fontSize: resolvedSize, 
        width: resolvedSize, 
        height: resolvedSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {LucideIcon ? (
        <LucideIcon size={resolvedSize} />
      ) : (
        name
      )}
    </div>
  );
};
