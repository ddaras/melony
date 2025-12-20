import React from "react";
import { ListProps } from "./component-types";
import { cn } from "@/lib/utils";

export const List: React.FC<ListProps> = ({ children, width, className, style }) => {
  return (
    <div
      className={cn("flex flex-col list-none p-0 m-0", className)}
      style={{
        width: width,
        ...style,
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};
