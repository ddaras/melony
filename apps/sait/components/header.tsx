import { navigationButton, themeToggle } from "melony";

import { text } from "melony";
import { hstack } from "melony";

export const header = () => {
  return hstack({
    className:
      "items-center border-b px-4 h-12 gap-8 sticky top-0 bg-background",
    children: [
      text({ content: "SAIT", className: "font-bold" }),
      hstack({
        children: [
          navigationButton({
            label: "Home",
            variant: "ghost",
            className: "flex-1 gap-1",
          }),
          navigationButton({
            label: "Docs",
            variant: "ghost",
            className: "flex-1 gap-1",
          }),
        ],
        className: "gap-1",
      }),
      themeToggle({
        className: "ml-auto",
      }),
    ],
  });
};
