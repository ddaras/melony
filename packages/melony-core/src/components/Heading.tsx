import React from "react";
import { useTheme } from "../theme";
import { HeadingProps } from "./component-types";

export const Heading: React.FC<HeadingProps> = ({ value, level = 2 }) => {
  const theme = useTheme();
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Tag style={{ fontFamily: theme.typography?.fontFamily }}>{value}</Tag>
  );
};

