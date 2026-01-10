import React from "react";
import { HiddenProps } from "./component-types";

export const Hidden: React.FC<HiddenProps> = ({ name, value }) => {
  return <input type="hidden" name={name} value={value} />;
};

