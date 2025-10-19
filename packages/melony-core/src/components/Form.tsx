import React from "react";
import { useActionHandler } from "../action-context";
import { useTheme } from "../theme";
import { FormProps } from "./component-types";

export const Form: React.FC<FormProps> = ({ children, onSubmitAction }) => {
  const handleAction = useActionHandler();
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (onSubmitAction) {
      const payload = {
        ...data,
        ...(onSubmitAction.payload || {}),
      };
      handleAction({ action: onSubmitAction.action, payload });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
