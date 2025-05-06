import { button, themeToggle } from "melony";

import { hstack } from "melony";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();

  return hstack({
    className:
      "items-center border-b px-4 h-12 gap-8 fixed top-0 left-0 w-full bg-background",
    children: [
      button({
        label: "Melony",
        variant: "ghost",
        className: "font-bold text-md",
        onClick: () => {
          router.push("/");
        },
      }),
      hstack({
        className: "gap-1 w-full",
        children: [
          button({
            label: "Docs",
            variant: "ghost",
            onClick: () => {
              router.push("/docs");
            },
          }),
          themeToggle({ className: "ml-auto" }),
        ],
      }),
    ],
  });
};
