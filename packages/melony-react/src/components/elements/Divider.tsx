import React from "react";
import { UIContract } from "melony";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { marginMap, colorBgMap } from "@/lib/theme-utils";

export const Divider: React.FC<UIContract["divider"]> = ({
  orientation = "horizontal",
  color = "border",
  margin = "md",
}) => {
  return (
    <Separator
      orientation={orientation}
      className={cn(
        marginMap[margin],
        colorBgMap[color]
      )}
    />
  );
};
