import { renderUI } from "../render/ui";
import { ThemeToggleConfig } from "../builder/types";

export const themeToggle = (config?: Omit<ThemeToggleConfig, "type">) => {
  return renderUI({
    type: "theme-toggle",
    ...config,
  });
};
