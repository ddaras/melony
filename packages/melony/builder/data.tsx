import { UIBuilder } from "./base";
import { DataTable } from "@melony/ui";
import { DataTableProps } from "@melony/ui";

export class TableBuilder extends UIBuilder {
  constructor(props?: DataTableProps) {
    super(DataTable);
    if (props) {
      this._props = { ...props };
    }
  }
}

export const table = (props: DataTableProps) => {
  return new TableBuilder(props);
}; 