import React from "react";
import { useTheme } from "../theme";
import { BoxProps } from "./component-types";

export const Box: React.FC<BoxProps> = ({
  children,
  padding = "md",
  margin,
  background,
  border = false,
  borderRadius,
  width,
  height,
  overflow = "visible",
}) => {
  const theme = useTheme();
  const resolvedPadding =
    theme.spacing?.[padding as keyof typeof theme.spacing] || padding;

  const resolvedBorderRadius = borderRadius
    ? theme.spacing?.[borderRadius as keyof typeof theme.spacing] ||
      theme.radius?.[borderRadius as keyof typeof theme.radius] ||
      borderRadius
    : undefined;

  return (
    <div
      style={{
        padding: resolvedPadding,
        margin: margin,
        background: background ?? undefined,
        border: border ? `1px solid ${theme.colors?.border}` : "none",
        borderRadius: resolvedBorderRadius,
        width: width,
        height: height,
        overflow: overflow,
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};
