import React from "react";
import { Label as LabelBase } from "../ui/label";
import { LabelProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Label: React.FC<LabelProps> = ({
  value,
  htmlFor,
  required,
  className,
  style,
}) => {
  return (
    <LabelBase
      htmlFor={htmlFor}
      className={cn("flex items-center gap-1", className)}
      style={style}
    >
      {value}
      {required && <span className="text-destructive">*</span>}
    </LabelBase>
  );
};
