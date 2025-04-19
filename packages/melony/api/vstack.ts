import { StackConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function vstack(
  children: React.ReactNode[],
  config?: Omit<StackConfig, "type" | "direction">
) {
  return renderUI({
    type: "stack",
    direction: "col",
    children,
    ...config,
  });
}
