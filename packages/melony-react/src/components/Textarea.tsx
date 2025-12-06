import React from "react";
import { useMelony } from "../melony-context";
import { useTheme } from "../theme";
import { TextareaProps } from "./component-types";
import { Label } from "./Label";

export const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  defaultValue,
  value,
  label,
  name,
  disabled,
  rows = 4,
  onChangeAction,
}) => {
  const { dispatchEvent } = useMelony();
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <textarea
        name={name}
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        disabled={disabled}
        rows={rows}
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
          resize: "vertical",
          minHeight: "80px",
        }}
      />
    </div>
  );
};
