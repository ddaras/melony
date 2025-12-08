import React, { useState } from "react";
import { useTheme } from "../theme";
import { ButtonProps } from "./component-types";
import { useMelony } from "../melony-context";
import { darkenColor } from "./helpers";

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  onClickAction,
  className,
  style,
}) => {
  const { dispatchEvent } = useMelony();
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getVariantStyles = () => {
    const baseStyles = {
      primary: {
        background: theme.colors?.primary || "#6366f1",
        color: "white",
        border: "none",
      },
      secondary: {
        background: theme.colors?.secondary || "#64748b",
        color: "white",
        border: "none",
      },
      outline: {
        background: "transparent",
        color: theme.colors?.primary || "#6366f1",
        border: `1px solid ${theme.colors?.primary || "#6366f1"}`,
      },
      success: {
        background: theme.colors?.success || "#22c55e",
        color: "white",
        border: "none",
      },
      danger: {
        background: theme.colors?.danger || "#f43f5e",
        color: "white",
        border: "none",
      },
    };

    const base = baseStyles[variant as keyof typeof baseStyles];

    if (disabled) {
      return base;
    }

    // Apply hover and active effects
    if (isActive) {
      // Active state: darker background and slight scale down
      if (variant === "outline") {
        return {
          ...base,
          background: theme.colors?.primary || "#6366f1",
          color: "white",
        };
      }
      return {
        ...base,
        background: darkenColor(base.background || "#6366f1", 20),
      };
    }

    if (isHovered) {
      // Hover state: slightly darker background
      if (variant === "outline") {
        return {
          ...base,
          background: `${theme.colors?.primary || "#6366f1"}15`,
        };
      }
      return {
        ...base,
        background: darkenColor(base.background || "#6366f1", 10),
      };
    }

    return base;
  };

  const sizes = {
    sm: {
      padding: `${theme.spacing?.xs} ${theme.spacing?.md}`,
      fontSize: theme.typography?.fontSize?.sm,
    },
    md: {
      padding: `${theme.spacing?.sm} ${theme.spacing?.lg}`,
      fontSize: theme.typography?.fontSize?.md,
    },
    lg: {
      padding: `${theme.spacing?.md} ${theme.spacing?.xl}`,
      fontSize: theme.typography?.fontSize?.lg,
    },
  };

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={() => {
        if (onClickAction) {
          dispatchEvent(onClickAction);
        }
      }}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{
        ...getVariantStyles(),
        ...sizes[size as keyof typeof sizes],
        borderRadius: theme.radius?.full,
        fontFamily: theme.typography?.fontFamily,
        fontWeight: theme.typography?.fontWeight?.medium,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? "100%" : "auto",
        transition: "all 0.2s ease",
        transform: isActive && !disabled ? "scale(0.98)" : "scale(1)",
        boxShadow:
          isHovered && !disabled && variant !== "outline"
            ? theme.shadows?.md || "0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            : "none",
        ...style,
      }}
    >
      {label}
    </button>
  );
};
