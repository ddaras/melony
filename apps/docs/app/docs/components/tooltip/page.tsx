"use client";

import {
  tooltip,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exampleCode = `tooltip({
  content: "Click to save your changes",
  children: (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      Save
    </button>
  ),
  side: "bottom",
  align: "start",
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Tooltip" }),
      text({
        content:
          "Tooltip is a component that displays additional information when hovering over an element.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              tooltip({
                content: "This is a tooltip",
                children: <button>Hover me</button>,
                side: "top",
                align: "center",
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
            name: "content",
            type: "string",
            description: "The text to display in the tooltip",
          },
          {
            name: "children",
            type: "React.ReactNode",
            description: "The element that triggers the tooltip on hover",
          },
          {
            name: "side",
            type: '"top" | "right" | "bottom" | "left"',
            description: "Optional position of the tooltip relative to the trigger element (default: 'top')",
          },
          {
            name: "align",
            type: '"start" | "center" | "end"',
            description: "Optional alignment of the tooltip relative to the trigger element (default: 'center')",
          },
          {
            name: "className",
            type: "string",
            description: "Optional CSS classes to apply to the tooltip",
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