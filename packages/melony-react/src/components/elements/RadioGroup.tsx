import React from "react";
import { RadioGroupProps } from "./component-types";
import { Label } from "./Label";
import { useMelony } from "@/hooks/use-melony";
import { cn } from "@/lib/utils";

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  defaultValue,
  value,
  label,
  disabled,
  orientation = "vertical",
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
          name: name,
          value: e.target.value,
        },
      } as any);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)} style={style}>
      {label && <Label value={label} className="text-sm font-semibold" />}
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row gap-4" : "flex-col gap-2"
        )}
      >
        {options.map((option, index) => {
          const radioId = `${name}-${index}`;
          const isDisabled = disabled || option.disabled;

          return (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <input
                type="radio"
                name={name}
                id={radioId}
                value={option.value}
                defaultChecked={
                  defaultValue === option.value ? true : undefined
                }
                checked={value === option.value}
                disabled={isDisabled}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label
                htmlFor={radioId}
                value={option.label}
                className={cn(
                  "cursor-pointer select-none text-sm font-medium leading-none",
                  isDisabled && "cursor-not-allowed opacity-50"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
