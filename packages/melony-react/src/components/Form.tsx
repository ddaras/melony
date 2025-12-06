import React from "react";
import { useMelony } from "../melony-context";
import { useTheme } from "../theme";
import { FormProps } from "./component-types";

export const Form: React.FC<FormProps> = ({ children, onSubmitAction }) => {
  const { dispatchEvent } = useMelony();
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (onSubmitAction) {
      dispatchEvent({
        ...onSubmitAction,
        data: {
          ...data,
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing?.md,
        }}
      >
        {children as React.ReactNode}
      </div>
    </form>
  );
};
