import {
  card,
  codeBlock,
  heading,
  table,
  text,
  vstack,
  themeToggle,
} from "melony";

const exmapleCode = `themeToggle()`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Theme Toggle" }),
      text({
        content:
          "The theme toggle is a component that allows you to toggle the theme of the app.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          themeToggle(),
          codeBlock({
            lang: "ts",
            code: exmapleCode,
          }),
        ],
      }),
      heading({ content: "Config", variant: "h4" }),
      table({
        data: [
          {
            name: "className",
            type: "string",
            description: "The class name to apply to the text",
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
            size: 120,
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
