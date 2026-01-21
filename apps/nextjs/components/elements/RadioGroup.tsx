import React from "react";
import { UIContract } from "../../ui-contract";
import { Label } from "./Label";
import { useMelony } from "@melony/react";
import { cn } from "@/lib/utils";

export const RadioGroup: React.FC<UIContract["radioGroup"]> = ({
  name,
  options,
  defaultValue,
  label,
  disabled,
  orientation = "vertical",
  onChangeAction,
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
    <div className="flex flex-col gap-3">
      {label && <Label value={label} />}
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row gap-4" : "flex-col gap-2",
        )}
      >
        {options.map((option, index) => {
          const radioId = `${name}-${index}`;
          const isDisabled = disabled || option.disabled;

          return (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name={name}
                id={radioId}
                value={option.value}
                defaultChecked={defaultValue === option.value}
                disabled={isDisabled}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label
                htmlFor={radioId}
                value={option.label}
                size="sm"
                color={isDisabled ? "muted" : "foreground"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
