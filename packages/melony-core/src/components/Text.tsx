import React, { CSSProperties } from "react";
import { useTheme } from "../theme";
import { TextProps } from "./component-types";

export const Text: React.FC<TextProps> = ({
  value,
  size = "md",
  weight = "normal",
  color,
  align = "start",
}) => {
  const theme = useTheme();

  const alignMap = {
    start: "left",
    center: "center",
    end: "right",
    stretch: "stretch",
  };

  return (
    <span
      style={{
        fontSize: theme.typography?.fontSize?.[size],
        fontWeight: theme.typography?.fontWeight?.[weight],
        fontFamily: theme.typography?.fontFamily,
        color: color || theme.colors?.foreground,
        textAlign: alignMap[align] as CSSProperties["textAlign"],
      }}
    >
      {value}
    </span>
  );
};
