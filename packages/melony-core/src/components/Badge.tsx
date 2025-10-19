import React from "react";
import { useTheme } from "../theme";
import { BadgeProps } from "./component-types";

export const Badge: React.FC<BadgeProps> = ({
  value,
  variant = "primary",
  size = "md",
}) => {
  const theme = useTheme();

  const variants = {
    primary: {
      background: theme.colors?.primary || "#3b82f6",
      color: "white",
    },
    secondary: {
      background: theme.colors?.secondary || "#6b7280",
      color: "white",
    },
    success: {
      background: theme.colors?.success || "#10b981",
      color: "white",
    },
    danger: {
      background: theme.colors?.danger || "#ef4444",
      color: "white",
    },
    warning: {
      background: theme.colors?.warning || "#f59e0b",
      color: "white",
    },
  };

  const sizes = {
    sm: {
      padding: `${theme.spacing?.xs || "4px"} ${theme.spacing?.sm || "8px"}`,
      fontSize: theme.typography?.fontSize?.xs || "0.75rem",
    },
    md: {
      padding: `${theme.spacing?.xs || "4px"} ${theme.spacing?.md || "8px"}`,
      fontSize: theme.typography?.fontSize?.sm || "0.875rem",
    },
    lg: {
      padding: `${theme.spacing?.sm || "8px"} ${theme.spacing?.lg || "12px"}`,
      fontSize: theme.typography?.fontSize?.md || "1rem",
    },
  };

  return (
    <span
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: theme.radius?.full || "9999px",
        fontFamily: theme.typography?.fontFamily,
        fontWeight: theme.typography?.fontWeight?.medium,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
};
