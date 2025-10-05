import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Snowflake,
} from "lucide-react";
import { weatherSchema } from "./weather-card.schema";

type WeatherCardProps = z.infer<typeof weatherSchema>;

const getWeatherIcon = (icon?: string, condition?: string) => {
  if (icon === "sunny" || condition?.toLowerCase().includes("sun")) {
    return <Sun className="h-12 w-12 text-yellow-500" />;
  }
  if (icon === "rainy" || condition?.toLowerCase().includes("rain")) {
    return <CloudRain className="h-12 w-12 text-blue-500" />;
  }
  if (icon === "snowy" || condition?.toLowerCase().includes("snow")) {
    return <Snowflake className="h-12 w-12 text-blue-200" />;
  }
  return <Cloud className="h-12 w-12 text-gray-500" />;
};


// define weather card component
export const WeatherCard: React.FC<WeatherCardProps> = (props) => {
  const {
    location,
    temperature,
    condition,
    humidity,
    windSpeed,
    description,
    icon,
  } = props;

  return (
    <Card className="overflow-hidden border-gray-200 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{location}</h3>
            <p className="text-sm text-gray-600">{condition}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center">
            {getWeatherIcon(icon, condition)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="w-[400px] pt-0">
        {/* Temperature */}
        <div className="mb-4 flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-red-500" />
          <span className="text-3xl font-bold text-gray-900">
            {temperature}°F
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="mb-4 text-sm text-gray-600">{description}</p>
        )}

        {/* Additional Details */}
        <div className="flex flex-wrap gap-2">
          {humidity !== undefined && (
            <Badge variant="secondary">
              <Droplets className="mr-1 h-3 w-3" />
              {humidity}% humidity
            </Badge>
          )}
          {windSpeed !== undefined && (
            <Badge variant="secondary">
              <Wind className="mr-1 h-3 w-3" />
              {windSpeed} mph
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
