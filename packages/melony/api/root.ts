import { RootConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function root(
  children: React.ReactNode[],
  config?: Omit<RootConfig, "type">
) {
  return renderUI({
    type: "root",
    children,
    ...config,
  });
}
