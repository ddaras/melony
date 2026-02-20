import React from "react";
import { UIContract } from "@melony/ui-kit";
import { useMelony } from "@melony/react";
import { Textarea as TextareaBase } from "../ui/textarea";
import { Field, FieldTitle } from "../ui/field";
import { cn } from "../lib/utils";
import { colorBgMap, colorBorderMap, radiusMap, shadowMap, widthMap } from "../lib/theme-utils";

export const Textarea: React.FC<UIContract["textarea"]> = ({
  placeholder,
  defaultValue,
  name,
  disabled,
  rows,
  required,
  width = "full",
  onChangeAction,
  background = "background",
  border = false,
  shadow = "none",
  radius = "none",
}) => {
  const { send } = useMelony();

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
        className={cn(
          background && colorBgMap[background],
          border && "border",
          shadow && shadowMap[shadow],
          radius && radiusMap[radius],
        )}
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
