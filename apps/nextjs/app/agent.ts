import { melony } from "melony";

import { checkWeather } from "./actions/check-weather";
import { brain } from "./brains/brain";

export const rootAgent = melony({
  brain,
  actions: { checkWeather },
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
