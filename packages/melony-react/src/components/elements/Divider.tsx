import React from "react";
import { Separator } from "../ui/separator";
import { DividerProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  className,
  style,
}) => {
  return (
    <Separator
      orientation={orientation as "horizontal" | "vertical"}
      className={cn("my-4", className)}
      style={style}
    />
  );
};
