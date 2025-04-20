import { ModalButtonConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const modalButton = (
  label: string,
  config?: Omit<ModalButtonConfig, "type" | "label">
) => {
  return renderUI({
    type: "modal-button",
    label,
    title: config?.title || "Untitled",
    content: config?.content || "Empty content",
    description: config?.description,
  });
};
