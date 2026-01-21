import React from "react";
import { UIContract } from "../../ui-contract";
import { useMelony } from "@melony/react";
import { Textarea as TextareaBase } from "../ui/textarea";
import { Field, FieldTitle } from "../ui/field";
import { cn } from "@/lib/utils";
import { widthMap } from "@/lib/theme-utils";

export const Textarea: React.FC<UIContract["textarea"]> = ({
  placeholder,
  defaultValue,
  label,
  name,
  disabled,
  rows,
  required,
  width = "full",
  onChangeAction,
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
    <Field className={cn(widthMap[width])}>
      {label && (
        <FieldTitle>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FieldTitle>
      )}
      <TextareaBase
        name={name}
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        rows={rows}
        onChange={handleChange}
        required={required}
      />
    </Field>
  );
};
