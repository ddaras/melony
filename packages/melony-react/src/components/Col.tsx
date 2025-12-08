import React from "react";
import { useTheme } from "../theme";
import { ColProps } from "./component-types";

export const Col: React.FC<ColProps> = ({
  children,
  gap = "sm",
  align = "start",
  justify = "start",
  wrap = "nowrap",
  flex = 1,
  width,
  height,
  padding,
  overflow,
  position = "static",
  className,
  style,
}) => {
  const theme = useTheme();
  const resolvedGap = theme.spacing?.[gap as keyof typeof theme.spacing] || gap;
  const resolvedPadding =
    theme.spacing?.[padding as keyof typeof theme.spacing] || padding;

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

  // Automatically add scrollable className for auto/scroll overflow
  const scrollableClassName = 
    (overflow === "auto" || overflow === "scroll") 
      ? "melony-scrollable" 
      : "";
  const combinedClassName = [className, scrollableClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={combinedClassName || undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: resolvedGap,
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
        flexWrap: wrap,
        flex: flex,
        width: width,
        height: height,
        padding: resolvedPadding,
        overflow: overflow,
        position: position,
        ...style,
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};
