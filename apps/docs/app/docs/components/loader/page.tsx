"use client";

import {
  loader,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exampleCode = `loader({
  size: "default",
  variant: "default",
  className: "text-primary",
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Loader" }),
      text({
        content:
          "Loader is a component that displays a loading spinner to indicate that content is being loaded or a process is in progress.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              loader({
                size: "default",
                variant: "default",
              }),
            ],
          }),
          codeBlock({
            lang: "ts",
            code: exampleCode,
          }),
        ],
      }),
      heading({ content: "Config", variant: "h4" }),
      table({
        data: [
          {
            name: "size",
            type: '"default" | "sm" | "lg"',
            description: "The size of the loader (default: 'default')",
          },
          {
            name: "variant",
            type: '"default" | "secondary" | "destructive"',
            description: "The visual style of the loader (default: 'default')",
          },
          {
            name: "className",
            type: "string",
            description: "Optional CSS classes to apply to the loader",
          },
        ],
        columns: [
          {
            header: "Name",
            accessorKey: "name",
            size: 140,
          },
          {
            header: "Type",
            accessorKey: "type",
            size: 300,
          },
          {
            header: "Description",
            accessorKey: "description",
          },
        ],
      }),
    ],
  });
} 