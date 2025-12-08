import React from "react";
import { useTheme } from "../theme";
import { CardProps } from "./component-types";

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  background,
  isLoading = false,
  className,
  style,
}) => {
  const theme = useTheme();

  return (
    <div
      className={className}
      style={{
        border: `1px solid ${theme.colors?.border}`,
        overflow: "hidden",
        background: background ?? theme.colors?.cardBackground,
        width: "100%",
        minWidth: "300px",
        maxWidth: "600px",
        borderRadius: theme.radius?.md,
        padding: theme.spacing?.sm,
        opacity: isLoading ? 0.6 : 1,
        ...style,
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
