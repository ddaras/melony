import React from "react";
import { UIContract } from "@melony/ui-kit";
import { useMelony } from "@melony/react";
import { Label } from "../ui/label";

export const Checkbox: React.FC<UIContract["checkbox"]> = ({
  label,
  name,
  checked,
  disabled,
  onChangeAction,
}) => {
  const { send } = useMelony();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeAction) {
      send({
        ...onChangeAction,
        data: {
          name: name || "",
          checked: e.target.checked,
        },
      } as any);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
      {label && (
        <Label
          htmlFor={name}
          className={disabled ? "text-muted-foreground" : "text-foreground"}
        >
          {label}
        </Label>
      )}
    </div>
  );
};
