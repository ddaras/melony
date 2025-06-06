import { Widget } from "@/schemas/widgets";
import { WeatherWidget } from "./weather-widget";
import { ClockWidget } from "./clock-widget";

export function WidgetRenderer({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case "clock":
      return <ClockWidget config={widget.config as {}} />;
    case "weather":
      return (
        <WeatherWidget
          config={
            widget.config as {
              temperature: number;
              condition: "sunny" | "cloudy" | "rainy" | "snowy";
              location: string;
              size?: "small" | "medium" | "large";
            }
          }
        />
      );
    default:
      return <div>Unknown widget</div>;
  }
}
