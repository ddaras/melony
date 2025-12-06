import React from "react";
import { useTheme } from "../theme";
import { ICONS } from "../icons";
import { IconProps } from "./component-types";

export const Icon: React.FC<IconProps> = ({ name, size, color }) => {
  const theme = useTheme();
  const IconComponent = ICONS[name];

  // Resolve size from theme if it's a theme size key
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
        : 20; // default size

  const resolvedColor = color || theme.colors?.foreground || "currentColor";

  return (
    <IconComponent size={resolvedSize} color={resolvedColor} strokeWidth={1} />
  );
};
