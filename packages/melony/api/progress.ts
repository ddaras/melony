import { ProgressConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const progress = (config: Omit<ProgressConfig, "type">) => {
  return renderUI({
    type: "progress",
    ...config,
  });
}; 