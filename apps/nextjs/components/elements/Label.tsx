import React from "react";
import { UIContract } from "../../ui-contract";
import { Label as LabelBase } from "../ui/label";
import { cn } from "@/lib/utils";
import { textSizeMap, colorTextMap } from "@/lib/theme-utils";

export const Label: React.FC<UIContract["label"]> = ({
  value,
  htmlFor,
  required,
  size = "md",
  color = "foreground",
}) => {
  return (
    <LabelBase
      htmlFor={htmlFor}
      className={cn(
        "flex items-center gap-1",
        textSizeMap[size],
        colorTextMap[color],
      )}
    >
      {value}
      {required && <span className="text-destructive">*</span>}
    </LabelBase>
  );
};
