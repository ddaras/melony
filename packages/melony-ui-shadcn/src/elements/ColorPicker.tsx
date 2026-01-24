import React, { useState, useEffect } from "react";
import { UIContract } from "@melony/ui-kit";
import { useMelony } from "@melony/react";
import { Field, FieldTitle } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../lib/utils";

const PRESET_COLORS = [
  "#000000",
  "#ffffff",
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#9e9e9e",
  "#607d8b",
];

export const ColorPicker: React.FC<UIContract["colorPicker"]> = ({
  name,
  label,
  defaultValue = "#000000",
  onChangeAction,
  disabled,
}) => {
  const { send } = useMelony();
  const [color, setColor] = useState(defaultValue);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (onChangeAction) {
      send({
        ...onChangeAction,
        data: {
          name: name || "",
          value: newColor,
        },
      } as any);
    }
  };

  return (
    <Field className="w-full">
      {label && <FieldTitle>{label}</FieldTitle>}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className={cn(
                "w-10 h-10 rounded-lg border border-border shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100",
                "flex items-center justify-center p-1",
              )}
            >
              <div
                className="w-full h-full rounded-md"
                style={{ backgroundColor: color }}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-3 w-64" side="bottom" align="start">
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={cn(
                      "w-6 h-6 rounded-md border border-border transition-transform hover:scale-110 active:scale-90",
                      color === preset && "ring-2 ring-primary ring-offset-1",
                    )}
                    style={{ backgroundColor: preset }}
                    onClick={() => handleColorChange(preset)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-8 h-8 rounded border-none p-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 h-8 px-2 text-xs font-mono border border-border rounded uppercase focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <span className="text-sm font-mono uppercase text-muted-foreground">
          {color}
        </span>
      </div>
      <input type="hidden" name={name} value={color} />
    </Field>
  );
};
