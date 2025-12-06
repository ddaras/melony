import React from "react";
import { useMelony } from "../melony-context";
import { useTheme } from "../theme";
import { SelectProps } from "./component-types";
import { Label } from "./Label";

export const Select: React.FC<SelectProps> = ({
  options = [],
  defaultValue,
  value,
  label,
  name,
  disabled,
  placeholder,
  onChangeAction,
}) => {
  const { dispatchEvent } = useMelony();
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChangeAction) {
      dispatchEvent({
        ...onChangeAction,
        data: {
          name: name || "",
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
        gap: theme.spacing?.xs,
      }}
    >
      {label && (
        <Label value={label} htmlFor={name} size="sm" weight="medium" />
      )}
      <select
        name={name}
        id={name}
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
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
