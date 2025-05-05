"use client";

import {
  progress,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exampleCode = `progress({
  value: 75,
  max: 100,
  className: "w-full",
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Progress" }),
      text({
        content:
          "Progress is a component that displays a progress bar to indicate the completion status of a task or process.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              progress({
                value: 75,
                max: 100,
                className: "w-full",
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
            name: "value",
            type: "number",
            description: "The current progress value",
          },
          {
            name: "max",
            type: "number",
            description: "The maximum progress value (default: 100)",
          },
          {
            name: "className",
            type: "string",
            description: "Optional CSS classes to apply to the progress bar",
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