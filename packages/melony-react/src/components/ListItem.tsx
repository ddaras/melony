import React, { useMemo } from "react";
import { useTheme } from "../theme";
import { ListItemProps } from "./component-types";
import { renderTemplate } from "@melony/client";
import { useMelony } from "../melony-context";

export const ListItem: React.FC<ListItemProps> = ({
  children,
  orientation = "horizontal",
  gap = "md",
  align,
  justify = "start",
  onClickAction,
  width,
  padding = "md",
}) => {
  const theme = useTheme();
  const { dispatchEvent } = useMelony();

  const resolvedPadding =
    theme.spacing?.[padding as keyof typeof theme.spacing] || padding;

  // Process template variables in onClickAction
  const processedOnClickAction = useMemo(() => {
    if (!onClickAction) return undefined;
    return renderTemplate(JSON.stringify(onClickAction));
  }, [onClickAction]);

  const isInteractive = !!processedOnClickAction;
  const resolvedGap = theme.spacing?.[gap as keyof typeof theme.spacing] || gap;

  // Default align to "start" for vertical orientation, "center" for horizontal
  const resolvedAlign =
    align ?? (orientation === "vertical" ? "start" : "center");

  const alignMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  };

  const justifyMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
  };

  const handleClick = () => {
    if (processedOnClickAction) {
      dispatchEvent(JSON.parse(processedOnClickAction));
    }
  };

  return (
    <div
      onClick={isInteractive ? handleClick : undefined}
      style={{
        display: "flex",
        flexDirection: orientation === "horizontal" ? "row" : "column",
        gap: resolvedGap,
        alignItems: alignMap[resolvedAlign],
        justifyContent: justifyMap[justify],
        padding: resolvedPadding,
        cursor: isInteractive ? "pointer" : "default",
        transition: "background-color 0.2s ease",
        borderRadius: theme.radius?.md,
        width: width,
      }}
      onMouseEnter={(e) => {
        if (isInteractive) {
          e.currentTarget.style.backgroundColor =
            theme.colors?.muted || "#f8fafc";
        }
      }}
      onMouseLeave={(e) => {
        if (isInteractive) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};
