import { ButtonConfig, NavigationButtonConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const button = (
  label: string,
  config?: Omit<ButtonConfig, "type" | "label">
) => {
  return renderUI({
    type: "button",
    label,
    ...config,
  });
};

export const navigationButton = (
  label: string,
  config?: Omit<NavigationButtonConfig, "type" | "label">
) => {
  return renderUI({
    type: "navigation-button",
    label,
    ...config,
  });
};
