import { FormConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const form = (
  children: React.ReactNode[],
  config?: Omit<FormConfig, "type" | "children">
) => {
  return renderUI({
    type: "form",
    ...config,
    children,
  });
};
