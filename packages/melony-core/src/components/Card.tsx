import React from "react";
import { useTheme } from "../theme";
import { CardProps } from "./component-types";

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  background,
  size = "md",
}) => {
  const theme = useTheme();

  const sizes = {
    sm: {
      width: "300px",
      borderRadius: theme.radius?.sm,
      padding: theme.spacing?.sm,
    },
    md: {
      width: "400px",
      borderRadius: theme.radius?.md,
      padding: theme.spacing?.sm,
    },
    lg: {
      width: "500px",
      borderRadius: theme.radius?.lg,
      padding: theme.spacing?.sm,
    },
    full: {
      width: "100%",
      borderRadius: theme.radius?.lg,
      padding: theme.spacing?.sm,
    },
  };

  return (
    <div
      style={{
        border: `1px solid ${theme.colors?.border}`,
        overflow: "hidden",
        background,
        ...sizes[size],
      }}
    >
      {(title || subtitle) && (
        <div
          style={{
            padding: sizes[size].padding,
          }}
        >
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: theme.typography?.fontSize?.xl,
                fontWeight: theme.typography?.fontWeight?.semibold,
                color: theme.colors?.foreground,
                fontFamily: theme.typography?.fontFamily,
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: theme.typography?.fontSize?.sm,
                color: theme.colors?.mutedForeground,
                fontFamily: theme.typography?.fontFamily,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div
        style={{
          padding: sizes[size].padding,
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing?.md,
        }}
      >
        {children as React.ReactNode}
      </div>
    </div>
  );
};
