import { melony } from "melony";

import { checkWeather } from "./actions/check-weather";
import { brain } from "./brains/brain";

export const rootAgent = melony({
  brain,
  actions: { checkWeather },
});

