import { ChipConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const chip = (
  label: string,
  config?: Omit<ChipConfig, "type" | "label">
) => {
  return renderUI({
    type: "chip",
    label,
    ...config,
  });
};
