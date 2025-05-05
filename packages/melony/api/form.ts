import { FormConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const form = (config?: Omit<FormConfig, "type">) => {
  return renderUI({
    type: "form",
    children: config?.children || [],
    ...config,
  });
};
