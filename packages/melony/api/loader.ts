import { LoaderConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const loader = (config?: Omit<LoaderConfig, "type">) => {
  return renderUI({
    type: "loader",
    ...config,
  });
}; 