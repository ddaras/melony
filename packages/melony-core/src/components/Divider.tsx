import React from "react";
import { useTheme } from "../theme";
import { DividerProps } from "./component-types";

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  size = "sm",
  color = "border",
}) => {
  const theme = useTheme();

  const resolvedSize =
    size === "sm"
      ? "1px"
      : size === "md"
        ? "2px"
        : size === "lg"
          ? "3px"
          : size === "xl"
            ? "4px"
            : size === "xxl"
              ? "5px"
              : size;
  const dividerColor = color || theme.colors?.border;

  const resolvedDividerColor = theme.colors?.[dividerColor];

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      style={{
        width: isHorizontal ? "100%" : resolvedSize,
        height: isHorizontal ? resolvedSize : "100%",
        backgroundColor: resolvedDividerColor,
        margin: isHorizontal ? `${resolvedSize} 0` : `0 ${resolvedSize}`,
        flexShrink: 0,
      }}
    />
  );
};
