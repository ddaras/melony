import { UIBuilder } from "./base";
import { Dropdown } from "@melony/ui";
import { DropdownProps } from "@melony/ui";

export class DropdownBuilder extends UIBuilder {
  constructor(props?: DropdownProps) {
    super(Dropdown);
    if (props) {
      this._props = { ...props };
    }
  }
}

export const dropdown = (props: DropdownProps) => {
  return new DropdownBuilder(props);
}; 