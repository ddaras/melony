import React from "react";
import { FontSize, useTheme } from "../theme";
import { HeadingProps } from "./component-types";

export const Heading: React.FC<HeadingProps> = ({ value, level = 2 }) => {
  const theme = useTheme();
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const sizeMap = {
    h1: "xxl",
    h2: "xl",
    h3: "lg",
    h4: "md",
    h5: "sm",
    h6: "xs",
  };

  const fontSize =
    theme.typography?.fontSize?.[
      sizeMap[Tag as keyof typeof sizeMap] as FontSize
    ];

  return (
    <Tag
      style={{
        fontFamily: theme.typography?.fontFamily,
        fontWeight: theme.typography?.fontWeight?.semibold,
        fontSize,
      }}
    >
      {value}
    </Tag>
  );
};
