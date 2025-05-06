import { ModalConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const modal = (config?: Omit<ModalConfig, "type">) => {
  return renderUI({
    type: "modal",
    label: config?.label || "Modal",
    title: config?.title || "Untitled",
    content: config?.content || (() => null),
    description: config?.description,
  });
};
