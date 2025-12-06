import React from "react";
import { useTheme } from "../theme";
import { RowProps } from "./component-types";

export const Row: React.FC<RowProps> = ({
  children,
  gap = "md",
  align = "start",
  justify = "start",
  wrap = false,
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
        flexDirection: "row",
        gap: resolvedGap,
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
        flexWrap: wrap ? "wrap" : "nowrap",
        flex: flex,
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};

