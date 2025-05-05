import { text, vstack } from "melony";

export const labeledValue = (label: string, value: string) => {
  return vstack({
    className: "mb-2 gap-1",
    children: [
      text({ content: label, className: "text-sm opacity-50" }),
      text({ content: value, className: "text-sm" }),
    ],
  });
};
