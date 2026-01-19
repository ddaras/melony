import React from "react";
import { UIContract } from "melony";
import {
  Card as CardBase,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { cn } from "@/lib/utils";
import {
  colorBgMap,
  paddingMap,
  radiusMap,
  shadowMap,
} from "@/lib/theme-utils";

export const Card: React.FC<
  UIContract["card"] & { children?: React.ReactNode[] }
> = ({
  children,
  title,
  subtitle,
  background,
  padding = "md",
  radius = "md",
  shadow = "md",
}) => {
  return (
    <CardBase
      className={cn(
        "min-w-96 relative",
        background && colorBgMap[background],
        radius && radiusMap[radius],
        shadow && shadowMap[shadow],
      )}
    >
      {(title || subtitle) && (
        <CardHeader className="pb-3">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("flex flex-col gap-4", paddingMap[padding])}>
        {children as React.ReactNode}
      </CardContent>
    </CardBase>
  );
};
