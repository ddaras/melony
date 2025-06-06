"use client";

import { vstack, text } from "melony";
import { BaseWidget } from "./widgets/base-widget";

interface ExampleWidgetProps {
  title: string;
  content: string;
  onRemove?: () => void;
  onSettings?: () => void;
}

export function ExampleWidget({
  title,
  content,
  onRemove,
  onSettings,
}: ExampleWidgetProps) {
  return (
    <BaseWidget id="example-widget" onRemove={onRemove} onSettings={onSettings}>
      {vstack({
        className: "w-full gap-2",
        children: [
          text({
            className: "font-medium",
            content: title,
          }),
          text({
            className: "text-sm opacity-50",
            content: content,
          }),
        ],
      })}
    </BaseWidget>
  );
}
