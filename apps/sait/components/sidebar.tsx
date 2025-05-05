import { navigationButton, vstack } from "melony";
import { headers } from "next/headers";

export const sidebar = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  return vstack({
    className: "w-64 p-4 border-r h-full",
    children: [
      vstack({
        children: [
          navigationButton({
            label: "Search routes",
            variant: pathname === "/" ? "secondary" : "ghost",
            className: "justify-start",
            href: "/",
          }),
        ],
      }),
    ],
  });
};
