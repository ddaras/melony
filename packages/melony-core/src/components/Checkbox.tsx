import React from "react";
import { useActionContext } from "../action-context";
import { useTheme } from "../theme";
import { CheckboxProps } from "./component-types";

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  value = "on",
  checked,
  defaultChecked,
  disabled,
  onChangeAction,
}) => {
  const { onAction } = useActionContext() || {};
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeAction) {
      onAction?.({
        ...onChangeAction,
        payload: {
          ...onChangeAction.payload,
          name: name || "",
          value: value,
          checked: e.target.checked,
        },
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: theme.spacing?.sm,
      }}
    >
      <input
        type="checkbox"
        name={name}
        id={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        style={{
          width: "18px",
          height: "18px",
          cursor: disabled ? "not-allowed" : "pointer",
          accentColor: theme.colors?.primary,
        }}
      />
      {label && (
        <label
          htmlFor={name}
          style={{
            fontSize: theme.typography?.fontSize?.md,
            fontFamily: theme.typography?.fontFamily,
            color: theme.colors?.foreground,
            cursor: disabled ? "not-allowed" : "pointer",
            userSelect: "none",
          }}
        >
          {label}
        </label>
      )}
    </div>
  );
};
