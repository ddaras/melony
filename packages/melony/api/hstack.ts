import { StackConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function hstack(
  children: React.ReactNode[],
  config?: Omit<StackConfig, "type" | "direction">
) {
  return renderUI({
    type: "stack",
    direction: "row",
    children,
    ...config,
  });
}
