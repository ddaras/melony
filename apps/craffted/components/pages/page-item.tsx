"use client";

import { Page } from "@/schemas/page";
import { button } from "melony";
import { vstack } from "melony";
import { useRouter } from "next/navigation";

export function PageItem({ page }: { page: Page }) {
  const navigate = useRouter();

  return vstack({
    children: [
      button({
        label: page.title,
        variant: "ghost",
        className: "w-full justify-start",
        onClick: () => {
          navigate.push(`/project/${page.project_id}/page/${page.id}`);
        },
      }),
    ],
  });
}
