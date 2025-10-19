import React from "react";
import { useTheme } from "../theme";
import { ListProps } from "./component-types";

export const List: React.FC<ListProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        listStyle: "none",
        padding: 0,
        margin: 0,
      }}
    >
      {children as React.ReactNode}
    </div>
  );
};

