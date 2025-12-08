import React, { useState } from "react";
import { useMelony } from "../melony-context";
import { useTheme } from "../theme";
import { FormProps } from "./component-types";

export const Form: React.FC<FormProps> = ({ children, onSubmitAction }) => {
  const { dispatchEvent } = useMelony();
  const theme = useTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitted) return;
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (onSubmitAction) {
      setIsSubmitted(true);
      dispatchEvent({
        ...onSubmitAction,
        data: {
          ...(onSubmitAction.data || {}),
          ...data,
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <fieldset disabled={isSubmitted} style={{ border: "none", padding: 0, margin: 0 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing?.md,
            opacity: isSubmitted ? 0.6 : 1,
            pointerEvents: isSubmitted ? "none" : "auto",
          }}
        >
          {children as React.ReactNode}
        </div>
      </fieldset>
    </form>
  );
};
