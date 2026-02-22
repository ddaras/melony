import React from "react";
import { UIContract } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import {
  textSizeMap,
  textAlignMap,
  fontWeightMap,
  colorTextMap,
} from "../lib/theme-utils";

export const Text: React.FC<UIContract["text"]> = ({
  value,
  size = "md",
  weight = "normal",
  align = "start",
  color
}) => {
  return (
    <span
      className={cn(
        textSizeMap[size],
        fontWeightMap[weight],
        textAlignMap[align],
        color && colorTextMap[color],
      )}
    >
      {value}
    </span>
  );
};
