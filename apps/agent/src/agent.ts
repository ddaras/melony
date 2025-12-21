import { melony } from "@melony/core";

import { checkWeather } from "./actions/check-weather";
import { persistEventsPlugin } from "./plugins/persist-events";
import { requireApprovalPlugin } from "./plugins/require-approval";
import { brain } from "./brains/brain";

export const rootAgent = melony({
  brain,
  actions: { checkWeather },
  plugins: [
    persistEventsPlugin,
    requireApprovalPlugin({ actions: ["checkWeather"] }),
  ],
});
