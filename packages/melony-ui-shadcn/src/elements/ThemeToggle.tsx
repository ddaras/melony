"use client";

import * as React from "react";
import { useTheme } from "../providers/theme-provider";
import { Button } from "../ui/button";
import { Icon } from "./Icon";
import { cn } from "../lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "light", icon: "Sun", label: "Light" },
    { name: "dark", icon: "Moon", label: "Dark" },
    { name: "system", icon: "Monitor", label: "System" },
  ] as const;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border bg-muted/50 p-1">
      {themes.map((t) => (
        <Button
          key={t.name}
          variant={theme === t.name ? "secondary" : "ghost"}
          size="icon-xs"
          onClick={() => setTheme(t.name as any)}
          className={cn(
            "rounded-full transition-all",
            theme === t.name && "shadow-xs bg-background hover:bg-background"
          )}
        >
          <Icon name={t.icon} size="sm" />
          <span className="sr-only">{t.label}</span>
        </Button>
      ))}
    </div>
  );
}
