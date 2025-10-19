import React from "react";
import { useTheme } from "../theme";
import { ImageProps } from "./component-types";

export const Image: React.FC<ImageProps> = ({ src, alt, size = "md" }) => {
  const theme = useTheme();
  const resolvedRadius = size
    ? theme.radius?.[size as keyof typeof theme.radius] || size
    : undefined;

  const sizes = {
    sm: 44,
    md: 88,
    lg: 176,
  };

  const resolvedWidth = size
    ? sizes[size as keyof typeof sizes] || size
    : undefined;

  const resolvedHeight = size
    ? sizes[size as keyof typeof sizes] || size
    : undefined;

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: resolvedWidth,
        height: resolvedHeight,
        border: `1px solid ${theme.colors?.border}`,
        borderRadius: resolvedRadius,
        display: "block",
      }}
    />
  );
};
