import React from "react";
import { HeadingProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Heading: React.FC<HeadingProps> = ({
  value,
  level = 2,
  className,
  style,
}) => {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const levelClasses: Record<string, string> = {
    h1: "text-3xl font-bold tracking-tight",
    h2: "text-2xl font-semibold tracking-tight",
    h3: "text-xl font-semibold tracking-tight",
    h4: "text-lg font-semibold tracking-tight",
    h5: "text-base font-semibold",
    h6: "text-sm font-semibold",
  };

  return (
    <Tag
      className={cn(
        levelClasses[Tag] || levelClasses.h2,
        "text-foreground",
        className
      )}
      style={style}
    >
      {value}
    </Tag>
  );
};
