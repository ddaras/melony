import { TooltipConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const tooltip = (config: Omit<TooltipConfig, "type">) => {
  return renderUI({
    type: "tooltip",
    ...config,
  });
}; 