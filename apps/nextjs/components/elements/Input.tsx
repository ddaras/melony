import React from "react";
import { UIContract } from "@melony/ui-kit";
import { useMelony } from "@melony/react";
import { Input as InputBase } from "../ui/input";
import { Field, FieldTitle } from "../ui/field";
import { cn } from "@/lib/utils";
import { widthMap } from "@/lib/theme-utils";

export const Input: React.FC<UIContract["input"]> = ({
  inputType = "text",
  placeholder,
  defaultValue,
  label,
  name,
  disabled,
  required,
  width = "full",
  onChangeAction,
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
    <Field className={cn(widthMap[width])}>
      {label && (
        <FieldTitle>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FieldTitle>
      )}
      <InputBase
        type={inputType}
        name={name}
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={handleChange}
        required={required}
      />
    </Field>
  );
};
