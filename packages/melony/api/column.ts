import { ColumnConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function column(key: string, label?: string) {
  const config: ColumnConfig = { key, label: label || key };

  return {
    key(value: string) {
      config.key = value;
      return this;
    },
    label(value: string) {
      config.label = value;
      return this;
    },
  };
}
