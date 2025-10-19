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
}) => {
  const theme = useTheme();
  const resolvedGap = theme.spacing?.[gap as keyof typeof theme.spacing] || gap;

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: resolvedGap,
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
        flexWrap: wrap,
        flex: flex,
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};
