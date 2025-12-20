import React from "react";
import { useMelony } from "@/hooks/use-melony";
import { Textarea as TextareaBase } from "../ui/textarea";
import { Field, FieldTitle } from "../ui/field";
import { TextareaProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  defaultValue,
  value,
  label,
  name,
  disabled,
  rows,
  onChangeAction,
  className,
  style,
}) => {
  const { sendEvent } = useMelony();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <TextareaBase
        name={name}
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        disabled={disabled}
        rows={rows}
        onChange={handleChange}
      />
    </Field>
  );
};
