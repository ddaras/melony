import { ChipConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const chip = (config?: Omit<ChipConfig, "type">) => {
  return renderUI({
    type: "chip",
    label: config?.label || "Chip",
    ...config,
  });
};
