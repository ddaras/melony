import React from "react";
import { useActionHandler } from "../action-context";
import { useTheme } from "../theme";
import { InputProps } from "./component-types";
import { Label } from "./Label";

export const Input: React.FC<InputProps> = ({
  inputType = "text",
  placeholder,
  defaultValue,
  value,
  label,
  name,
  disabled,
  onChangeAction,
}) => {
  const handleAction = useActionHandler();
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeAction) {
      const payload = {
        name: name || "",
        value: e.target.value,
        ...(onChangeAction.payload || {}),
      };
      handleAction({ action: onChangeAction.action, payload });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing?.xs,
      }}
    >
      {label && (
        <Label value={label} htmlFor={name} size="sm" weight="medium" />
      )}
      <input
        type={inputType}
        name={name}
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        style={{
          padding: `${theme.spacing?.sm} ${theme.spacing?.md}`,
          border: `1px solid ${theme.colors?.inputBorder}`,
          borderRadius: theme.radius?.sm,
          fontSize: theme.typography?.fontSize?.md,
          fontFamily: theme.typography?.fontFamily,
          background: theme.colors?.inputBackground,
          color: theme.colors?.foreground,
          outline: "none",
          transition: "border-color 0.2s ease",
        }}
      />
    </div>
  );
};
