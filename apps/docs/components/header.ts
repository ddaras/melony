import { navigationButton, themeToggle } from "melony";

import { hstack } from "melony";

export const header = () => {
  return hstack({
    className:
      "items-center border-b px-4 h-12 gap-8 fixed top-0 left-0 w-full bg-background",
    children: [
      navigationButton({
        label: "Melony",
        variant: "ghost",
        className: "font-bold text-md",
      }),
      hstack({
        className: "gap-1 w-full",
        children: [
          navigationButton({
            label: "Docs",
            variant: "ghost",
            href: "/docs",
          }),
          themeToggle({ className: "ml-auto" }),
        ],
      }),
    ],
  });
};
