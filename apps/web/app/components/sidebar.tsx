import { navigationButton } from "melony";
import { vstack } from "melony";

export const sidebar = ({ pathname }: { pathname: string }) => {
  const items = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Articles",
      href: "/articles",
    },
  ];

  return vstack()
    .className("w-64 border-r p-2")
    .children(
      items.map((item) =>
        navigationButton({ label: item.label, href: item.href })
          .variant(pathname === item.href ? "secondary" : "ghost")
          .className("justify-start h-8")
      )
    );
};
