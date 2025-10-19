import React from "react";
import { useTheme } from "../theme";
import { DividerProps } from "./component-types";

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  size = "md",
  color = "border",
}) => {
  const theme = useTheme();
  const resolvedSize =
    theme.spacing?.[size as keyof typeof theme.spacing] || size;
  const dividerColor = color || theme.colors?.border;

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      style={{
        width: isHorizontal ? "100%" : resolvedSize,
        height: isHorizontal ? resolvedSize : "100%",
        backgroundColor: dividerColor,
        margin: isHorizontal ? `${resolvedSize} 0` : `0 ${resolvedSize}`,
        flexShrink: 0,
      }}
    />
  );
};
