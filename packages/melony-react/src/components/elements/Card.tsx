import React from "react";
import {
  Card as CardBase,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { CardProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className,
  style,
}) => {
  return (
    <CardBase
      className={cn("min-w-96", className)}
      style={style}
    >
      {(title || subtitle) && (
        <CardHeader className="pb-3">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="flex flex-col gap-4">
        {children as React.ReactNode}
      </CardContent>
    </CardBase>
  );
};
