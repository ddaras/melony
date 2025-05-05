import {
  button,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exmapleCode = `button({
  label: "Click me",
})`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Button" }),
      text({
        content: "Button is a component that displays a button.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              button({
                label: "Click me",
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
            name: "label",
            type: "string",
            description: "The text to display",
          },
          {
            name: "variant",
            type: "default | outline | ghost | link | destructive",
            description: "The variant of the button",
          },
          {
            name: "className",
            type: "string",
            description: "The class name to apply to the button",
          },
          {
            name: "disabled",
            type: "boolean",
            description: "Whether the button is disabled",
          },
          {
            name: "isLoading",
            type: "boolean",
            description: "Whether the button is loading",
          },
          {
            name: "onClick",
            type: "() => void",
            description: "The function to call when the button is clicked",
          },
          {
            name: "submit",
            type: "boolean",
            description: "Whether the button is a submit button",
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
