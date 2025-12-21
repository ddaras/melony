import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Initialize theme from localStorage on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored) {
        setThemeState(stored);
      }
    }
  }, []);

  // Update resolved theme based on theme preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "system") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const updateResolvedTheme = () => {
          setResolvedTheme(mediaQuery.matches ? "dark" : "light");
        };

        updateResolvedTheme();
        mediaQuery.addEventListener("change", updateResolvedTheme);

        return () => mediaQuery.removeEventListener("change", updateResolvedTheme);
      } else {
        setResolvedTheme(theme);
      }
    }
  }, [theme]);

  // Apply theme class to document
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      
      if (resolvedTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

