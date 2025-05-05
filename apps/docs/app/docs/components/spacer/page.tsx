"use client";

import {
  spacer,
  card,
  codeBlock,
  heading,
  text,
  hstack,
  vstack,
} from "melony";

const exampleCode = `// Horizontal spacing
hstack({
  children: [
    text({ content: "Left" }),
    spacer({ className: "w-8" }), // 2rem width
    text({ content: "Right" }),
  ],
});

// Vertical spacing
vstack({
  children: [
    text({ content: "Top" }),
    spacer({ className: "h-8" }), // 2rem height
    text({ content: "Bottom" }),
  ],
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Spacer" }),
      text({
        content:
          "Spacer is a component that creates flexible space between elements in a stack.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          vstack({
            className: "gap-4",
            children: [
              text({ content: "Horizontal spacing example:" }),
              hstack({
                className: "p-4 border rounded-lg",
                children: [
                  text({ content: "Left" }),
                  spacer({ className: "w-8" }),
                  text({ content: "Right" }),
                ],
              }),
              text({ content: "Vertical spacing example:" }),
              vstack({
                className: "p-4 border rounded-lg",
                children: [
                  text({ content: "Top" }),
                  spacer({ className: "h-8" }),
                  text({ content: "Bottom" }),
                ],
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
      card({
        className: "flex flex-col gap-4",
        children: [
          text({
            content: "Spacer accepts the following configuration options:",
          }),
          vstack({
            className: "gap-2",
            children: [
              text({
                content: "• className: string - CSS classes to control the spacer's dimensions (e.g., 'w-8' for width, 'h-8' for height)",
              }),
            ],
          }),
        ],
      }),
    ],
  });
} 