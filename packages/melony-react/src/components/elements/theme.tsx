import React, { createContext, useContext, useEffect, useState } from "react";

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
  darkColors?: {
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
  darkColors: {
    primary: "#818cf8",
    secondary: "#94a3b8",
    success: "#4ade80",
    danger: "#fb7185",
    warning: "#fbbf24",
    info: "#38bdf8",

    background: "#0f172a",
    foreground: "#f8fafc",
    muted: "#334155",
    mutedForeground: "#94a3b8",
    border: "#475569",

    cardBackground: "#1e293b",
    cardBorder: "#334155",
    inputBackground: "#1e293b",
    inputBorder: "#475569",
    inputFocus: "#818cf8",
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

// Dark mode shadows (more subtle for dark backgrounds)
const darkShadows: MelonyTheme["shadows"] = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
  md: "0 2px 4px -1px rgba(0, 0, 0, 0.4)",
  lg: "0 4px 6px -2px rgba(0, 0, 0, 0.5)",
  xl: "0 8px 12px -4px rgba(0, 0, 0, 0.6)",
};

// Hook to detect dark mode
function useDarkMode(): boolean {
  // Always start with false to match SSR, then update after hydration
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted after first render to avoid hydration mismatch
    setMounted(true);

    if (typeof window === "undefined") return;

    // Check for dark mode on mount
    const checkDarkMode = () => {
      const html = document.documentElement;
      if (html.classList.contains("dark")) {
        setIsDark(true);
        return;
      }

      // Check for prefers-color-scheme media query
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setIsDark(true);
      }
    };

    checkDarkMode();

    // Watch for .dark class changes
    const observer = new MutationObserver(() => {
      const html = document.documentElement;
      setIsDark(html.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Watch for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if .dark class is not present (system preference)
      if (!document.documentElement.classList.contains("dark")) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Return false during SSR and initial client render to avoid hydration mismatch
  if (!mounted) {
    return false;
  }

  return isDark;
}

const ThemeContext = createContext<MelonyTheme>(defaultTheme);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  theme?: Partial<MelonyTheme>;
}> = ({ children, theme = {} }) => {
  const isDark = useDarkMode();

  const mergedTheme = React.useMemo(() => {
    const baseColors = { ...defaultTheme.colors, ...theme.colors };
    const baseDarkColors = { ...defaultTheme.darkColors, ...theme.darkColors };

    // Use dark colors if dark mode is active, otherwise use light colors
    const activeColors = isDark
      ? { ...baseColors, ...baseDarkColors }
      : baseColors;

    return {
      colors: activeColors,
      darkColors: baseDarkColors,
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
      shadows: isDark
        ? { ...darkShadows, ...theme.shadows }
        : { ...defaultTheme.shadows, ...theme.shadows },
    };
  }, [theme, isDark]);

  // Inject global custom scrollbar styles
  useEffect(() => {
    const styleId = "melony-global-scrollbar";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Global custom scrollbar styles for all scrollable elements */
      .melony-scrollable::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .melony-scrollable::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .melony-scrollable::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
        border-radius: 4px;
        transition: background 0.2s ease;
      }
      
      .melony-scrollable:hover::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
      }
      
      .melony-scrollable:hover::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .melony-scrollable:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .melony-scrollable:hover::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
      
      .dark .melony-scrollable:hover::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .dark .melony-scrollable:hover::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      /* For Firefox */
      .melony-scrollable {
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
      }
      
      .melony-scrollable:hover {
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
      }
      
      @media (prefers-color-scheme: dark) {
        .melony-scrollable:hover {
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
      }
      
      .dark .melony-scrollable:hover {
        scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
