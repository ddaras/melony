"use client";

import {
  avatar,
  card,
  codeBlock,
  heading,
  text,
  vstack,
  hstack,
} from "melony";

const exampleCode = `// Basic avatar with image
avatar({
  src: "https://github.com/shadcn.png",
  name: "John Doe",
});

// Avatar with fallback
avatar({
  src: "https://broken-link.com/image.png",
  name: "John Doe",
});

// Avatar with custom size
avatar({
  src: "https://github.com/shadcn.png",
  name: "John Doe",
  className: "w-16 h-16",
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Avatar" }),
      text({
        content:
          "Avatar is a component that displays a user's profile picture with a fallback option.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            className: "gap-8 p-4 border rounded-lg",
            children: [
              avatar({
                src: "https://github.com/shadcn.png",
                name: "John Doe",
              }),
              avatar({
                src: "https://broken-link.com/image.png",
                name: "John Doe",
              }),
              avatar({
                src: "https://github.com/shadcn.png",
                name: "John Doe",
                className: "w-16 h-16",
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
            content: "Avatar accepts the following configuration options:",
          }),
          vstack({
            className: "gap-2",
            children: [
              text({
                content: "• src: string - The URL of the avatar image",
              }),
              text({
                content: "• name: string - The name of the user (used for fallback)",
              }),
              text({
                content: "• className: string - Additional CSS classes to apply to the avatar",
              }),
            ],
          }),
        ],
      }),
    ],
  });
} 