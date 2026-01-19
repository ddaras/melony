import React from "react";
import { UIContract } from "melony";

export const Hidden: React.FC<UIContract["hidden"]> = ({ name, value }) => {
  return <input type="hidden" name={name} value={value} />;
};

