"use client";

import {
  chip,
  card,
  codeBlock,
  heading,
  text,
  vstack,
  hstack,
} from "melony";

const exampleCode = `// Default chip
chip({
  label: "Default",
});

// Outline chip
chip({
  label: "Outline",
  variant: "outline",
});

// Custom styled chip
chip({
  label: "Custom",
  className: "bg-purple-500 text-white",
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Chip" }),
      text({
        content:
          "Chip is a component that displays a small piece of information, such as a label or status.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            className: "gap-4 p-4 border rounded-lg flex-wrap",
            children: [
              chip({ label: "Default" }),
              chip({ label: "Outline", variant: "outline" }),
              chip({
                label: "Custom",
                className: "bg-purple-500 text-white",
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
            content: "Chip accepts the following configuration options:",
          }),
          vstack({
            className: "gap-2",
            children: [
              text({
                content: "• label: string - The text to display in the chip",
              }),
              text({
                content: "• variant: 'default' | 'outline' - The visual style of the chip",
              }),
              text({
                content: "• className: string - Additional CSS classes to apply to the chip",
              }),
            ],
          }),
        ],
      }),
    ],
  });
} 