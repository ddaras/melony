import { StackConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function hstack(config?: Omit<StackConfig, "type" | "direction">) {
  return renderUI({
    type: "stack",
    direction: "row",
    children: config?.children || [],
    ...config,
  });
}
