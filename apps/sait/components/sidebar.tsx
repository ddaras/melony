import { navigationButton, vstack } from "melony";
import { headers } from "next/headers";

export const sidebar = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  return vstack(
    [
      vstack([
        navigationButton("People", {
          variant: pathname === "/people" ? "secondary" : "ghost",
          className: "justify-start",
          href: "/people",
        }),
        navigationButton("Companies", {
          variant: pathname === "/companies" ? "secondary" : "ghost",
          className: "justify-start",
          href: "/companies",
        }),
        navigationButton("Opportunities", {
          variant: pathname === "/opportunities" ? "secondary" : "ghost",
          className: "justify-start",
          href: "/opportunities",
        }),
        navigationButton("Tasks", {
          variant: pathname === "/tasks" ? "secondary" : "ghost",
          className: "justify-start",
          href: "/tasks",
        }),
      ]),
    ],
    {
      className: "w-64 p-4 border-r h-full",
    }
  );
};
