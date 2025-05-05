import { TextConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const text = (config?: Omit<TextConfig, "type">) => {
  return renderUI({
    type: "text",
    content: config?.content || "Text",
    ...config,
  });
};
