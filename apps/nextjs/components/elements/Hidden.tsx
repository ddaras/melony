import React from "react";
import { UIContract } from "../../ui-contract";

export const Hidden: React.FC<UIContract["hidden"]> = ({ name, value }) => {
  return <input type="hidden" name={name} value={value} />;
};
