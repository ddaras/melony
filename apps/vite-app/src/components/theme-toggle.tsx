import { useTheme } from "./theme-provider";
import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "system") {
      return <IconDeviceDesktop className="h-4 w-4" />;
    }
    return resolvedTheme === "dark" ? (
      <IconMoon className="h-4 w-4" />
    ) : (
      <IconSun className="h-4 w-4" />
    );
  };

  const getLabel = () => {
    if (theme === "system") {
      return "System";
    }
    return resolvedTheme === "dark" ? "Dark" : "Light";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Toggle theme (current: ${getLabel()})`}
      title={`Current: ${getLabel()}. Click to cycle: Light → Dark → System`}
    >
      {getIcon()}
    </Button>
  );
}
