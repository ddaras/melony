import { RootConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function root(config?: Omit<RootConfig, "type">) {
  return renderUI({
    type: "root",
    children: config?.children || [],
    ...config,
  });
}
