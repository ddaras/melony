import React from "react";
import { useTheme } from "../theme";
import { LabelProps } from "./component-types";

export const Label: React.FC<LabelProps> = ({
  value,
  htmlFor,
  required,
  size = "sm",
  weight = "medium",
}) => {
  const theme = useTheme();

  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: theme.typography?.fontSize?.[size],
        fontWeight: theme.typography?.fontWeight?.[weight],
        color: theme.colors?.foreground,
        fontFamily: theme.typography?.fontFamily,
        display: "block",
      }}
    >
      {value}
      {required && (
        <span
          style={{
            color: theme.colors?.danger || "#ef4444",
            marginLeft: "2px",
          }}
        >
          *
        </span>
      )}
    </label>
  );
};

