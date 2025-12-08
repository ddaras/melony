import React from "react";
import { useTheme } from "../theme";
import { ListItemProps } from "./component-types";
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
  style,
}) => {
  const theme = useTheme();
  const { dispatchEvent } = useMelony();

  const paddingMap = {
    xs: "4px 6px",
    sm: "6px 8px",
    md: "8px 12px",
    lg: "12px 16px",
    xl: "16px 24px",
    xxl: "32px 40px",
  };

  const resolvedPadding =
    paddingMap[padding as keyof typeof paddingMap] || padding;

  const isInteractive = !!onClickAction;
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
    if (onClickAction) {
      dispatchEvent(onClickAction);
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
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isInteractive) {
          e.currentTarget.style.backgroundColor =
            theme.colors?.muted || "#f8fafc";
        }
      }}
      onMouseLeave={(e) => {
        if (isInteractive) {
          // Restore the original background color from the style prop
          e.currentTarget.style.backgroundColor =
            (style?.backgroundColor as string) || "transparent";
        }
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};
