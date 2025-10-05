import { zodSchemaToPrompt } from "melony";
import z from "zod";

// define schema
export const weatherSchema = z.object({
  type: z.literal("weather-card"),
  location: z.string(),
  temperature: z.number(),
  condition: z.string(),
  humidity: z.number().min(0).max(100).optional(),
  windSpeed: z.number().optional(),
  description: z.string().optional(),
  icon: z.enum(["sunny", "cloudy", "rainy", "snowy"]).optional(),
});

// generate AI prompt automatically
export const weatherCardUIComponentPrompt = zodSchemaToPrompt({
  type: "weather-card",
  schema: weatherSchema,
  description:
    "Use for displaying current weather information with temperature, conditions, and additional details.",
  examples: [
    {
      type: "weather-card",
      location: "New York, NY",
      temperature: 72,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 8,
      description: "Light winds with occasional clouds",
      icon: "cloudy",
    },
    {
      type: "weather-card",
      location: "Los Angeles, CA",
      temperature: 85,
      condition: "Sunny",
      humidity: 40,
      windSpeed: 5,
      description: "Clear skies and warm temperatures",
      icon: "sunny",
    },
  ],
});
