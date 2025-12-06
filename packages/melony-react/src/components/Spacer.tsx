import React from "react";
import { useTheme } from "../theme";
import { SpacerProps } from "./component-types";

export const Spacer: React.FC<SpacerProps> = ({
  size = "md",
  direction = "vertical",
}) => {
  const theme = useTheme();
  const resolvedSize =
    theme.spacing?.[size as keyof typeof theme.spacing] || size;

  return (
    <div
      style={{
        width: direction === "horizontal" ? resolvedSize : "auto",
        height: direction === "vertical" ? resolvedSize : "auto",
        flexShrink: 0,
      }}
    />
  );
};

