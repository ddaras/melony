import React from "react";
import { useMelony } from "@/hooks/use-melony";
import { CheckboxProps } from "./component-types";
import { Label } from "./Label";
import { cn } from "@/lib/utils";

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  checked,
  defaultChecked,
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
          checked: e.target.checked,
        },
      } as any);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)} style={style}>
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
      {label && (
        <Label
          htmlFor={name}
          value={label}
          className={cn(
            "cursor-pointer select-none text-sm font-medium leading-none",
            disabled && "cursor-not-allowed opacity-50"
          )}
        />
      )}
    </div>
  );
};
