"use client";

import {
  codeBlock,
  card,
  heading,
  text,
  vstack,
} from "melony";

const exampleCode = `// Basic code block
codeBlock({
  code: "const greeting = 'Hello, World!';",
  lang: "ts",
});

// Code block with custom styling
codeBlock({
  code: "const greeting = 'Hello, World!';",
  lang: "ts",
  className: "bg-gray-100 p-4 rounded-lg",
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Code Block" }),
      text({
        content:
          "CodeBlock is a component that displays code snippets with syntax highlighting.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          vstack({
            className: "gap-4",
            children: [
              text({ content: "Basic code block:" }),
              codeBlock({
                code: "const greeting = 'Hello, World!';\nconsole.log(greeting);",
                lang: "ts",
              }),
              text({ content: "Code block with custom styling:" }),
              codeBlock({
                code: "const greeting = 'Hello, World!';\nconsole.log(greeting);",
                lang: "ts",
                className: "bg-gray-100 p-4 rounded-lg",
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
            content: "CodeBlock accepts the following configuration options:",
          }),
          vstack({
            className: "gap-2",
            children: [
              text({
                content: "• code: string - The code to display",
              }),
              text({
                content: "• lang: string - The programming language for syntax highlighting",
              }),
              text({
                content: "• className: string - Additional CSS classes to apply to the code block",
              }),
            ],
          }),
        ],
      }),
    ],
  });
} 