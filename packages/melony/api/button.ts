import { ButtonConfig, NavigationButtonConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const button = (config?: Omit<ButtonConfig, "type">) => {
  return renderUI({
    type: "button",
    label: config?.label || "Button",
    ...config,
  });
};

export const navigationButton = (
  config?: Omit<NavigationButtonConfig, "type">
) => {
  return renderUI({
    type: "navigation-button",
    label: config?.label || "Navigate",
    ...config,
  });
};
