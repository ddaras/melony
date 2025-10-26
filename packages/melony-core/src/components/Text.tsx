import React, { CSSProperties, useMemo } from "react";
import { useTheme } from "../theme";
import { TextProps } from "./component-types";
import { useContextValue } from "../context-provider";
import { TemplateEngine } from "../template-engine";

export const Text: React.FC<TextProps> = ({
  value,
  size = "md",
  weight = "normal",
  color,
  align = "start",
}) => {
  const theme = useTheme();
  const context = useContextValue();

  const processedValue = useMemo(() => {
    return TemplateEngine.render(value, context || {});
  }, [value, context]);

  const alignMap = {
    start: "left",
    center: "center",
    end: "right",
    stretch: "stretch",
  };

  return (
    <span
      style={{
        fontSize: theme.typography?.fontSize?.[size],
        fontWeight: theme.typography?.fontWeight?.[weight],
        fontFamily: theme.typography?.fontFamily,
        color: color || theme.colors?.foreground,
        textAlign: alignMap[align] as CSSProperties["textAlign"],
      }}
    >
      {processedValue}
    </span>
  );
};
