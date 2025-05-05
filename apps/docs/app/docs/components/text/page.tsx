import { card, codeBlock, heading, table, text, vstack } from "melony";

const exmapleCode = `text({
  content: "This is a text component.",
  className: "text-pink-500",
})`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Text" }),
      text({
        content: "Text is a component that displays a single line of text.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          text({
            content: "This is a text component.",
            className: "text-pink-500",
          }),
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
            name: "content",
            type: "string",
            description: "The text to display",
          },
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
