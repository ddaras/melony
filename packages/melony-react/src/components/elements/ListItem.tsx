import React from "react";
import { ListItemProps } from "./component-types";
import { useMelony } from "@/hooks/use-melony";
import { cn } from "@/lib/utils";

export const ListItem: React.FC<ListItemProps> = ({
  children,
  orientation = "horizontal",
  gap = "md",
  align,
  justify = "start",
  onClickAction,
  width,
  padding = "md",
  className,
  style,
}) => {
  const { sendEvent } = useMelony();

  const paddingClasses: Record<string, string> = {
    xs: "px-1.5 py-1",
    sm: "px-2 py-1.5",
    md: "px-3 py-1.5",
    lg: "px-4 py-3",
    xl: "px-6 py-4",
  };

  const isInteractive = !!onClickAction;
  
  const gapClasses: Record<string, string> = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
    xl: "gap-6",
  };

  const resolvedAlign = align ?? (orientation === "vertical" ? "start" : "center");

  const alignClasses: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  const handleClick = () => {
    if (onClickAction) {
      sendEvent(onClickAction as any);
    }
  };

  return (
    <div
      onClick={isInteractive ? handleClick : undefined}
      className={cn(
        "flex rounded-md transition-colors text-sm",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        gapClasses[gap as keyof typeof gapClasses] || "gap-3",
        alignClasses[resolvedAlign as keyof typeof alignClasses],
        justifyClasses[justify as keyof typeof justifyClasses],
        paddingClasses[padding as keyof typeof paddingClasses] || "px-3 py-2",
        isInteractive ? "cursor-pointer hover:bg-muted" : "cursor-default",
        className
      )}
      style={{
        width: width,
        ...style,
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};
