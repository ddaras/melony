import { FieldConfig } from "@melony/ui";
import { ColumnConfig, TableConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function table(
  data: any[],
  config?: Omit<TableConfig, "type" | "data">
) {
  return renderUI({
    type: "table",
    ...config,
    data,
  });
}
