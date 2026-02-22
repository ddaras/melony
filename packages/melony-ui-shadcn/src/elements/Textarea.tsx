import React from "react";
import { UIContract } from "@melony/ui-kit";
import { useMelony } from "@melony/react";
import { Textarea as TextareaBase } from "../ui/textarea";
import { Field } from "../ui/field";
import { cn } from "../lib/utils";
import { widthMap } from "../lib/theme-utils";

export const Textarea: React.FC<UIContract["textarea"]> = ({
  placeholder,
  defaultValue,
  name,
  disabled,
  rows,
  required,
  width = "full",
  onChangeAction,
  onSubmitAction,
  submitOnEnter,
}) => {
  const { send } = useMelony();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (submitOnEnter && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (onSubmitAction) {
        send({
          ...onSubmitAction,
          data: {
            name: name || "",
            value: e.currentTarget.value,
          },
        } as any);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChangeAction) {
      send({
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
      <TextareaBase
        name={name}
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        rows={rows}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        required={required}
      />
    </Field>
  );
};
