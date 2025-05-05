import { ModalButtonConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const modalButton = (config?: Omit<ModalButtonConfig, "type">) => {
  return renderUI({
    type: "modal-button",
    label: config?.label || "Modal Button",
    title: config?.title || "Untitled",
    content: config?.content || (() => null),
    description: config?.description,
  });
};
