"use client";

import { Project } from "@/schemas/projects";
import { useRouter } from "next/navigation";
import { button, vstack } from "melony";

export function ProjectItem({ project }: { project: Project }) {
  const navigate = useRouter();

  return vstack({
    children: [
      button({
        label: project.title,
        variant: "ghost",
        className: "w-full justify-start",
        onClick: () => {
          navigate.push(`/project/${project.id}`);
        },
      }),
    ],
  });
}
