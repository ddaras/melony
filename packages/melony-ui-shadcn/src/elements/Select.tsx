import React from "react";
import { UIContract } from "@melony/ui-kit";
import { useMelony } from "@melony/react";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Field, FieldTitle } from "../ui/field";
import { cn } from "../lib/utils";
import { widthMap } from "../lib/theme-utils";

export const Select: React.FC<UIContract["select"]> = ({
  options,
  defaultValue,
  label,
  name,
  disabled,
  required,
  width = "full",
  placeholder,
  onChangeAction,
}) => {
  const { send } = useMelony();

  const handleValueChange = (val: string) => {
    if (onChangeAction) {
      send({
        ...onChangeAction,
        data: {
          name: name || "",
          value: val,
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
      <SelectRoot
        defaultValue={defaultValue}
        disabled={disabled}
        onValueChange={(value) => handleValueChange(value || "")}
        required={required}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Field>
  );
};
