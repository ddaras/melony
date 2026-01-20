import { melony } from "melony";

import { checkWeather } from "./actions/check-weather";

export const rootAgent = melony({
  actions: { checkWeather },
  hooks: {
    onBeforeRun: async function* ({ event }) {
      if (event.role === "user" && event.type === "text") {
        const text = event.data?.content;

        if (text?.toLowerCase().includes("weather")) {
          return {
            action: "checkWeather",
            params: { location: "San Francisco" },
          };
        }

        yield {
          type: "text-delta",
          data: {
            delta: "Hello! I am your Melony assistant. Ask me about the weather!",
          },
        };
      }
    },
    onAfterAction: async function* ({ action, data }) {
      if (action.name === "checkWeather") {
        yield {
          type: "text-delta",
          data: {
            delta: `Weather check complete: ${data?.description}`,
          },
        };
      }
    },
  },
  starterPrompts: [
    {
      label: "What is the weather in San Francisco?",
      prompt: "What is the weather in San Francisco?",
    },
    {
      label: "What is the weather in London?",
      prompt: "What is the weather in London?",
    },
    {
      label: "What is the weather in Paris?",
      prompt: "What is the weather in Paris?",
    },
    {
      label: "What is the weather in Berlin?",
      prompt: "What is the weather in Berlin?",
    },
  ],
});
