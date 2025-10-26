import React, { useMemo } from "react";
import { useTheme } from "../theme";
import { ListItemProps } from "./component-types";
import { useContextValue } from "../context-provider";
import { TemplateEngine } from "../template-engine";
import { useActionDispatch } from "../use-action";

export const ListItem: React.FC<ListItemProps> = ({
  children,
  orientation = "horizontal",
  gap = "md",
  align,
  justify = "start",
  onClickAction,
}) => {
  const theme = useTheme();
  const context = useContextValue();
  const dispatch = useActionDispatch();

  // Process template variables in onClickAction
  const processedOnClickAction = useMemo(() => {
    if (!onClickAction) return undefined;
    return TemplateEngine.render(JSON.stringify(onClickAction), context || {});
  }, [onClickAction, context]);

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
      dispatch(JSON.parse(processedOnClickAction));
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
        padding: theme.spacing?.md || "12px",
        cursor: isInteractive ? "pointer" : "default",
        transition: "background-color 0.2s ease",
        borderRadius: theme.radius?.md,
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
