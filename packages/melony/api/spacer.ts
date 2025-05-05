import { SpacerConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const spacer = (config?: Omit<SpacerConfig, "type">) => {
  return renderUI({
    type: "spacer",
    content: config?.content || "Spacer",
    ...config,
  });
};
