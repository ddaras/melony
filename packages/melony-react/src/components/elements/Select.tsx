import React from "react";
import { useMelony } from "@/hooks/use-melony";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Field, FieldTitle } from "../ui/field";
import { SelectProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Select: React.FC<SelectProps> = ({
  options,
  defaultValue,
  value,
  label,
  name,
  disabled,
  placeholder,
  onChangeAction,
  className,
  style,
}) => {
  const { sendEvent } = useMelony();

  const handleValueChange = (val: string) => {
    if (onChangeAction) {
      sendEvent({
        ...onChangeAction,
        data: {
          name: name || "",
          value: val,
        },
      } as any);
    }
  };

  return (
    <Field className={cn("w-full", className)} style={style}>
      {label && <FieldTitle>{label}</FieldTitle>}
      <SelectRoot
        defaultValue={defaultValue}
        value={value}
        disabled={disabled}
        onValueChange={(value) => handleValueChange(value || "")}
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
