import { action, ui } from "melony";
import { z } from "zod";
import { weatherCard } from "../uis/weather-card";

export const checkWeatherParamsSchema = z.object({
  location: z.string(),
});

export const checkWeather = action({
  name: "checkWeather",
  paramsSchema: checkWeatherParamsSchema,
  execute: async function* (params) {
    yield {
      type: "text",
      data: { content: `Checking weather for ${params.location}...` },
    };

    await new Promise((r) => setTimeout(r, 1000));

    yield {
      type: "ui",
      ui: weatherCard(params),
    };

    return {
      description: `The weather in ${params.location} is looking great!`,
    };
  },
});
