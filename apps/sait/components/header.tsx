import { navigationButton } from "melony";

import { text } from "melony";
import { hstack } from "melony";

export const header = () => {
  return hstack(
    [
      text("TwentyCRMClone", {
        className: "font-bold",
      }),
      hstack(
        [
          navigationButton("Home", {
            variant: "ghost",
            className: "flex-1 gap-1",
          }),
          navigationButton("Docs", {
            variant: "ghost",
            className: "flex-1 gap-1",
          }),
        ],
        {
          className: "gap-1",
        }
      ),
    ],
    {
      className: "items-center border-b px-4 h-12 gap-8",
    }
  );
};
