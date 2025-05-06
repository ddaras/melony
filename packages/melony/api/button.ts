import { ButtonConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const button = (config?: Omit<ButtonConfig, "type">) => {
  return renderUI({
    type: "button",
    label: config?.label || "Button",
    ...config,
  });
};
