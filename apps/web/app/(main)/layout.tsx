"use client";

import { sidebarLayout } from "../components/sidebar-layout";
import { usePathname } from "next/navigation";
import { query, loader, vstack } from "melony";
import { getProfileAction } from "@/lib/actions/auth";

export default function MainLayout({
  children,
}: {
  children: React.JSX.Element;
}) {
  const pathname = usePathname();

  return query()
    .name("getProfile")
    .action(getProfileAction)
    .render((query) => {
      if (query.isPending) {
        return vstack()
          .className("w-full h-screen flex items-center justify-center")
          .child(vstack().className("gap-2").child(loader()));
      }

      return sidebarLayout({
        children,
        pathname,
      });
    });
}
