import React from "react";
import { UIContract } from "@melony/ui-kit";
import {
  Card as CardBase,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { cn } from "../lib/utils";
import {
  colorBgMap,
  paddingMap,
  radiusMap,
  shadowMap,
} from "../lib/theme-utils";

export const Card: React.FC<
  UIContract["card"] & { children?: React.ReactNode }
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
        "w-full max-w-full relative overflow-hidden transition-all duration-200",
        background && colorBgMap[background],
        radius && radiusMap[radius],
        shadow && shadowMap[shadow],
        !shadow && "shadow-sm border border-border/40",
      )}
    >
      {(title || subtitle) && (
        <CardHeader className="py-2.5 px-3 space-y-0.5 border-b border-border/40 bg-muted/5">
          {title && <CardTitle className="text-sm font-semibold tracking-tight leading-none">{title}</CardTitle>}
          {subtitle && <CardDescription className="text-xs leading-tight text-muted-foreground/80">{subtitle}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("flex flex-col gap-2", paddingMap[padding])}>
        {children}
      </CardContent>
    </CardBase>
  );
};
