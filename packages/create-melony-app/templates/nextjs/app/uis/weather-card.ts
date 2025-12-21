import { ui } from "melony";
import { checkWeatherParamsSchema } from "../actions/check-weather";
import { z } from "zod";

export const weatherCard = (params: z.infer<typeof checkWeatherParamsSchema>) =>
  ui.card({
    title: `Weather in ${params.location}`,
    children: [
      ui.text("Sunny, 25°C"),
      ui.row({
        children: [
          ui.button({
            label: "See details",
            onClickAction: {
              type: "see-details",
              data: {
                actionName: "seeDetails",
                params: { location: params.location },
              },
            },
          }),
        ],
      }),
    ],
  });

