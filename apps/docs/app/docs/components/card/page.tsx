import { card, codeBlock, heading, table, text, vstack } from "melony";

const exmapleCode = `card({
  children: [
    text({
      content: "Card content",
    }),
  ],
})`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Card" }),
      text({
        content: "Card is a component that displays a card.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          card({
            children: [
              text({
                content: "Card content",
              }),
            ],
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
            name: "title",
            type: "string",
            description: "The title of the card",
          },
          {
            name: "description",
            type: "string",
            description: "The description of the card",
          },
          {
            name: "className",
            type: "string",
            description: "The class name to apply to the card",
          },
          {
            name: "children",
            type: "React.ReactNode[]",
            description: "The children of the card",
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
