"use client";

import { vstack, text } from "melony";
import { useEffect, useState } from "react";
import { BaseWidget } from "./base-widget";

interface ClockWidgetProps {
  config: {};
  onRemove?: () => void;
  onSettings?: () => void;
}

export function ClockWidget({
  config,
  onRemove,
  onSettings,
}: ClockWidgetProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = time.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <BaseWidget id="clock-widget" onRemove={onRemove} onSettings={onSettings}>
      {vstack({
        className: "w-full min-w-[250px] items-center justify-center gap-2",
        children: [
          text({
            className: "text-3xl font-bold",
            content: formattedTime,
          }),
          text({
            className: "text-sm opacity-50",
            content: formattedDate,
          }),
        ],
      })}
    </BaseWidget>
  );
}
