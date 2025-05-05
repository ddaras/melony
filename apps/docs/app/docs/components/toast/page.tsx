"use client";

import {
  toast,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
  button,
} from "melony";

const exampleCode = `toast("Changes saved successfully", {
  description: "Your changes have been saved to the database.",
  variant: "success",
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Toast" }),
      text({
        content:
          "Toast is a component that displays a temporary notification message to the user. It's commonly used for success, error, or informational messages.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              button({
                label: "Show Toast",
                onClick: () =>
                  toast("Changes saved successfully", {
                    description: "Your changes have been saved to the database.",
                    variant: "success",
                  }),
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
            name: "message",
            type: "string",
            description: "The main message to display in the toast",
          },
          {
            name: "description",
            type: "string",
            description: "Optional additional description text",
          },
          {
            name: "variant",
            type: '"default" | "success" | "error" | "warning" | "info" | "loading"',
            description: "The visual style of the toast (default: 'default')",
          },
          {
            name: "duration",
            type: "number",
            description: "How long the toast should be visible in milliseconds (default: 5000)",
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