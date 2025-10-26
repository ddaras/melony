import React from "react";
import { useTheme } from "../theme";
import { ButtonProps } from "./component-types";
import { useActionDispatch } from "../use-action";

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  onClickAction,
}) => {
  const dispatch = useActionDispatch();
  const theme = useTheme();

  const variants = {
    primary: {
      background: theme.colors?.primary,
      color: "white",
      border: "none",
    },
    secondary: {
      background: theme.colors?.secondary,
      color: "white",
      border: "none",
    },
    outline: {
      background: "transparent",
      color: theme.colors?.primary,
      border: `1px solid ${theme.colors?.primary}`,
    },
    success: {
      background: theme.colors?.success,
      color: "white",
      border: "none",
    },
    danger: {
      background: theme.colors?.danger,
      color: "white",
      border: "none",
    },
  };

  const sizes = {
    sm: {
      padding: `${theme.spacing?.xs} ${theme.spacing?.sm}`,
      fontSize: theme.typography?.fontSize?.sm,
    },
    md: {
      padding: `${theme.spacing?.sm} ${theme.spacing?.md}`,
      fontSize: theme.typography?.fontSize?.md,
    },
    lg: {
      padding: `${theme.spacing?.md} ${theme.spacing?.lg}`,
      fontSize: theme.typography?.fontSize?.lg,
    },
  };

  return (
    <button
      disabled={disabled}
      onClick={() => {
        if (onClickAction) {
          dispatch(onClickAction);
        }
      }}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: theme.radius?.full,
        fontFamily: theme.typography?.fontFamily,
        fontWeight: theme.typography?.fontWeight?.medium,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? "100%" : "auto",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
};
