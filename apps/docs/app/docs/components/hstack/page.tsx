"use client";

import {
  hstack,
  card,
  codeBlock,
  heading,
  text,
  vstack,
} from "melony";

const exampleCode = `hstack({
  className: "gap-4",
  children: [
    text({ content: "First item" }),
    text({ content: "Second item" }),
    text({ content: "Third item" }),
  ],
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "HStack" }),
      text({
        content:
          "HStack is a component that arranges its children horizontally with consistent spacing.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            className: "gap-4 p-4 border rounded-lg",
            children: [
              text({ content: "First" }),
              text({ content: "Second" }),
              text({ content: "Third" }),
            ],
          }),
          codeBlock({
            lang: "ts",
            code: exampleCode,
          }),
        ],
      }),
      heading({ content: "Config", variant: "h4" }),
      card({
        className: "flex flex-col gap-4",
        children: [
          text({
            content: "HStack accepts the following configuration options:",
          }),
          vstack({
            className: "gap-2",
            children: [
              text({
                content: "• className: string - Additional CSS classes to apply to the stack",
              }),
              text({
                content: "• children: ReactNode[] - The elements to be stacked horizontally",
              }),
            ],
          }),
        ],
      }),
    ],
  });
} 