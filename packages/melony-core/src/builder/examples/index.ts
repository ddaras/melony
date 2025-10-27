/**
 * Example Widgets
 * Demonstrates how to use the Builder API
 */

export { WeatherWidget, weatherSchema } from "./weather-widget";
export { UserProfileWidget, userProfileSchema } from "./user-profile-widget";
export { ChartWidget, chartWidgetSchema } from "./chart-widget";

// Export all examples as an array for easy use
import { WeatherWidget } from "./weather-widget";
import { UserProfileWidget } from "./user-profile-widget";
import { ChartWidget } from "./chart-widget";

export const exampleWidgets = [
  WeatherWidget,
  UserProfileWidget,
  ChartWidget,
];

