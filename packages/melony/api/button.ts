import { ButtonConfig } from "../builder/types";
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
