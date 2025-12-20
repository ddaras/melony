import React from "react";
import { useMelony } from "@/hooks/use-melony";
import { Input as InputBase } from "../ui/input";
import { Field, FieldTitle } from "../ui/field";
import { InputProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Input: React.FC<InputProps> = ({
  inputType = "text",
  placeholder,
  defaultValue,
  value,
  label,
  name,
  disabled,
  onChangeAction,
  className,
  style,
}) => {
  const { sendEvent } = useMelony();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeAction) {
      sendEvent({
        ...onChangeAction,
        data: {
          name: name || "",
          value: e.target.value,
        },
      } as any);
    }
  };

  return (
    <Field className={cn("w-full", className)} style={style}>
      {label && <FieldTitle>{label}</FieldTitle>}
      <InputBase
        type={inputType}
        name={name}
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        disabled={disabled}
        onChange={handleChange}
      />
    </Field>
  );
};
