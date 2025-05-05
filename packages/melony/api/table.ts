import { TableConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function table(config?: Omit<TableConfig, "type">) {
  return renderUI({
    type: "table",
    ...config,
    data: config?.data || [],
  });
}
