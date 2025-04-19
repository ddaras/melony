import { button } from "melony";

import { text } from "melony";
import { hstack } from "melony";

export const header = () => {
  return hstack(
    [
      text("YourApp", {
        className: "font-bold",
      }),
      hstack(
        [
          button("Home", {
            className: "flex-1 gap-1",
          }),
          button("Docs", {
            className: "flex-1 gap-1",
          }),
        ],
        {
          className: "flex-1 gap-1",
        }
      ),
    ],
    {
      className: "items-center border-b px-4 h-12 gap-8",
    }
  );
};
