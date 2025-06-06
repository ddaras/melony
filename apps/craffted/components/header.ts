import { button, spacer, themeToggle } from "melony";

import { hstack } from "melony";
import { useRouter } from "next/navigation";
import { AuthButton } from "./auth-button";

export const Header = () => {
  const router = useRouter();

  return hstack({
    className: "items-center px-2 h-12 gap-8 fixed top-0 left-0 w-full z-10",
    children: [
      button({
        label: "CRAFFTED",
        variant: "ghost",
        className: "font-montserrat italic font-black text-md text-xl",
        onClick: () => {
          router.push("/");
        },
      }),
      hstack({
        className: "gap-2 w-full",
        children: [
          spacer({ className: "ml-auto" }),
          AuthButton(),
          themeToggle(),
        ],
      }),
    ],
  });
};
