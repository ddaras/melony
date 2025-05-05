import { card, codeBlock, heading, table, text, vstack } from "melony";

const exmapleCode = `heading({
  content: "This is a heading component.",
  variant: "h4",
})`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Heading" }),
      text({
        content: "Heading is a component that displays a heading.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          heading({
            content: "This is a heading component.",
            variant: "h4",
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
            name: "variant",
            type: "h1 | h2 | h3 | h4 | h5 | h6",
            description: "The variant of the heading",
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
            size: 220,
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
