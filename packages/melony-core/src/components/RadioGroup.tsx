import React from "react";
import { useTheme } from "../theme";
import { RadioGroupProps } from "./component-types";
import { Label } from "./Label";
import { useActionContext } from "../action-context";

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  defaultValue,
  value,
  label,
  disabled,
  orientation = "vertical",
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
          name: name,
          value: e.target.value,
        },
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing?.sm,
      }}
    >
      {label && <Label value={label} size="sm" weight="medium" />}
      <div
        style={{
          display: "flex",
          flexDirection: orientation === "horizontal" ? "row" : "column",
          gap: theme.spacing?.md,
        }}
      >
        {options.map((option, index) => {
          const radioId = `${name}-${index}`;
          const isDisabled = disabled || option.disabled;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing?.sm,
              }}
            >
              <input
                type="radio"
                name={name}
                id={radioId}
                value={option.value}
                defaultChecked={
                  defaultValue === option.value ? true : undefined
                }
                checked={value === option.value}
                disabled={isDisabled}
                onChange={handleChange}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  accentColor: theme.colors?.primary,
                }}
              />
              <label
                htmlFor={radioId}
                style={{
                  fontSize: theme.typography?.fontSize?.md,
                  fontFamily: theme.typography?.fontFamily,
                  color: theme.colors?.foreground,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  userSelect: "none",
                  opacity: isDisabled ? 0.6 : 1,
                }}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
