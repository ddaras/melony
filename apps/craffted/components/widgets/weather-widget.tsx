"use client";

import { vstack, text, hstack } from "melony";
import { Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";
import { BaseWidget } from "./base-widget";

interface WeatherWidgetProps {
  config: {
    temperature: number;
    condition: "sunny" | "cloudy" | "rainy" | "snowy";
    location: string;
  };
  onRemove?: () => void;
  onSettings?: () => void;
}

export function WeatherWidget({
  config,
  onRemove,
  onSettings,
}: WeatherWidgetProps) {
  const getWeatherIcon = () => {
    switch (config.condition) {
      case "sunny":
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="w-6 h-6 text-gray-400" />;
      case "rainy":
        return <CloudRain className="w-6 h-6 text-blue-400" />;
      case "snowy":
        return <CloudSnow className="w-6 h-6 text-blue-200" />;
    }
  };

  return (
    <BaseWidget id="weather-widget" onRemove={onRemove} onSettings={onSettings}>
      {vstack({
        className: "w-full max-w-[250px] gap-2 items-center justify-center",
        children: [
          vstack({
            className: "gap-2 w-full",
            children: [
              text({
                className: "font-bold text-xl",
                content: config.location,
              }),
              hstack({
                className: "items-center gap-2",
                children: [
                  getWeatherIcon(),
                  text({
                    className: "text-5xl font-bold",
                    content: `${config.temperature}°C`,
                  }),
                ],
              }),
              text({
                className: "text-sm opacity-50 capitalize",
                content: config.condition,
              }),
            ],
          }),
        ],
      })}
    </BaseWidget>
  );
}
