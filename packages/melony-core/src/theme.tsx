import React, { createContext, useContext } from "react";

export type Color =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "background"
  | "foreground"
  | "muted"
  | "mutedForeground"
  | "border"
  | "cardBackground"
  | "cardBorder"
  | "inputBackground"
  | "inputBorder"
  | "inputFocus";
export type Spacing = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type Radius = "sm" | "md" | "lg" | "full";
export type FontSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type FontWeight = "normal" | "medium" | "semibold" | "bold";
export type Shadow = "sm" | "md" | "lg" | "xl";

export interface MelonyTheme {
  colors?: {
    [key in Color]?: string;
  };

  spacing?: {
    [key in Spacing]?: string;
  };

  radius?: {
    [key in Radius]?: string;
  };

  typography?: {
    fontFamily?: string;
    fontSize?: {
      [key in FontSize]?: string;
    };
    fontWeight?: {
      [key in FontWeight]?: number;
    };
  };

  shadows?: {
    [key in Shadow]?: string;
  };
}

export const defaultTheme: MelonyTheme = {
  colors: {
    primary: "#6366f1",
    secondary: "#64748b",
    success: "#22c55e",
    danger: "#f43f5e",
    warning: "#f59e0b",
    info: "#0ea5e9",

    background: "#ffffff",
    foreground: "#0f172a",
    muted: "#f8fafc",
    mutedForeground: "#64748b",
    border: "#e2e8f0",

    cardBackground: "#ffffff",
    cardBorder: "#e2e8f0",
    inputBackground: "#ffffff",
    inputBorder: "#cbd5e1",
    inputFocus: "#6366f1",
  },

  spacing: {
    xs: "2px",
    sm: "6px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },

  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    full: "9999px",
  },

  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      xs: "11px",
      sm: "13px",
      md: "14px",
      lg: "16px",
      xl: "18px",
      xxl: "20px",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
    md: "0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 4px 6px -2px rgba(0, 0, 0, 0.08)",
    xl: "0 8px 12px -4px rgba(0, 0, 0, 0.1)",
  },
};

const ThemeContext = createContext<MelonyTheme>(defaultTheme);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  theme?: Partial<MelonyTheme>;
}> = ({ children, theme = {} }) => {
  const mergedTheme = React.useMemo(
    () => ({
      colors: { ...defaultTheme.colors, ...theme.colors },
      spacing: { ...defaultTheme.spacing, ...theme.spacing },
      radius: { ...defaultTheme.radius, ...theme.radius },
      typography: {
        ...defaultTheme.typography,
        ...theme.typography,
        fontSize: {
          ...defaultTheme.typography?.fontSize,
          ...theme.typography?.fontSize,
        },
        fontWeight: {
          ...defaultTheme.typography?.fontWeight,
          ...theme.typography?.fontWeight,
        },
      },
      shadows: { ...defaultTheme.shadows, ...theme.shadows },
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
