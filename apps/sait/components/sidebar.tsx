"use client";

import { button, vstack } from "melony";
import { useRouter } from "next/navigation";

export const sidebar = () => {
  const router = useRouter();

  return vstack(
    [
      vstack([
        button("People", {
          variant: "ghost",
          className: "justify-start",
          onClick: () => {
            router.push("/people");
          },
        }),
        button("Companies", {
          variant: "ghost",
          className: "justify-start",
          onClick: () => {
            router.push("/companies");
          },
        }),
        button("Opportunities", {
          variant: "ghost",
          className: "justify-start",
        }),
        button("Tasks", {
          variant: "ghost",
          className: "justify-start",
        }),
      ]),
    ],
    {
      className: "w-64 p-4 border-r h-full",
    }
  );
};
