import { melony } from "melony";
import { requireApproval } from "melony/plugins/require-approval";

import { checkWeather } from "./actions/check-weather";
import { persistEventsPlugin } from "./plugins/persist-events";
import { brain } from "./brains/brain";

export const rootAgent = melony({
  brain,
  actions: { checkWeather },
  plugins: [
    persistEventsPlugin,
    requireApproval({ actions: ["checkWeather"] }),
  ],
});
