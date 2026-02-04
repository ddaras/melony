import React from "react";
import { UIContract } from "@melony/ui-kit";
import { Separator } from "../ui/separator";
import { cn } from "../lib/utils";
import { marginMap, colorBgMap } from "../lib/theme-utils";

export const Divider: React.FC<UIContract["divider"]> = ({
  orientation = "horizontal",
  color = "border",
  margin = "none",
}) => {
  return (
    <Separator
      orientation={orientation}
      className={cn(marginMap[margin], colorBgMap[color])}
    />
  );
};
