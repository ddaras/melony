import React from "react";
import { useTheme } from "../theme";
import { CardProps } from "./component-types";

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  background,
}) => {
  const theme = useTheme();

  return (
    <div
      style={{
        border: `1px solid ${theme.colors?.border}`,
        overflow: "hidden",
        background: background ?? theme.colors?.cardBackground,
        minWidth: "380px",
        width: "100%",
        borderRadius: theme.radius?.lg,
        padding: theme.spacing?.sm,
      }}
    >
      {(title || subtitle) && (
        <div
          style={{
            padding: theme.spacing?.sm,
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
          padding: theme.spacing?.sm,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: theme.spacing?.md,
        }}
      >
        {children as React.ReactNode}
      </div>
    </div>
  );
};
