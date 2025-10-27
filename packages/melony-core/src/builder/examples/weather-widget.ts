/**
 * Weather Widget Example
 * Demonstrates how to use the Builder API to create a weather widget
 */

import { z } from "zod";
import { defineWidget } from "../define-widget";
import { card, row, text, badge, divider } from "../helpers";

// Define the schema for the widget
export const weatherSchema = z.object({
  type: z.literal("weather-card"),
  location: z.string().describe("City and state/country"),
  temperature: z.number().describe("Temperature in Fahrenheit"),
  condition: z.string().describe("Weather condition (e.g., Sunny, Cloudy)"),
  humidity: z.number().min(0).max(100).optional().describe("Humidity percentage"),
  windSpeed: z.number().optional().describe("Wind speed in mph"),
  description: z.string().optional().describe("Additional weather description"),
  icon: z.enum(["sunny", "cloudy", "rainy", "snowy"]).optional(),
});

// Define the widget using the builder API
export const WeatherWidget = defineWidget({
  type: "weather-card",
  name: "Weather Card",
  description: "Display current weather information with temperature, conditions, and additional details",
  schema: weatherSchema,
  
  // Type-safe builder function with full intellisense!
  builder: (props) => {
    return card(
      { title: `${props.location} Weather` },
      [
        // Temperature and condition row
        row(
          { gap: "md", align: "center" },
          [
            text({ value: `${props.temperature}°F`, size: "xl", weight: "bold" }),
            badge({ label: props.condition, variant: "primary" }),
          ]
        ),
        
        // Optional description
        ...(props.description 
          ? [text({ value: props.description, color: "muted" })]
          : []
        ),
        
        // Divider if we have additional details
        ...(props.humidity !== undefined || props.windSpeed !== undefined
          ? [divider({ orientation: "horizontal" })]
          : []
        ),
        
        // Additional details row
        ...(props.humidity !== undefined || props.windSpeed !== undefined
          ? [row(
              { gap: "sm", wrap: "wrap" },
              [
                ...(props.humidity !== undefined
                  ? [badge({ label: `${props.humidity}% humidity`, variant: "secondary" })]
                  : []
                ),
                ...(props.windSpeed !== undefined
                  ? [badge({ label: `${props.windSpeed} mph wind`, variant: "secondary" })]
                  : []
                ),
              ]
            )]
          : []
        ),
      ]
    );
  },
  
  // Provide examples for the AI
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
  
  // Default props (optional)
  defaultProps: {
    type: "weather-card",
    location: "Unknown",
    temperature: 70,
    condition: "Clear",
  },
});

// Now you can use WeatherWidget.template for the AI prompt
// and WeatherWidget.prompt for system instructions

