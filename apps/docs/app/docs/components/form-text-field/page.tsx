"use client";

import {
  form,
  formTextField,
  button,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exampleCode = `formTextField({
  name: "name",
  label: "Name",
  onSearch: (value) => console.log(value),
  isLoading: false,
  className: "w-full",
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Form Text Field" }),
      text({
        content:
          "Form Text Field is a component that displays a text input field within a form.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              form({
                onSubmit: (data) => console.log(data),
                children: [
                  formTextField({
                    name: "name",
                    label: "Name",
                  }),
                  button({
                    label: "Submit",
                    submit: true,
                  }),
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
      table({
        data: [
          {
            name: "name",
            type: "string",
            description: "The name of the field",
          },
          {
            name: "label",
            type: "string",
            description: "The label to display above the field",
          },
          {
            name: "onSearch",
            type: "(value: string) => void",
            description: "Function to call when the field value changes",
          },
          {
            name: "isLoading",
            type: "boolean",
            description: "Whether the field is in a loading state",
          },
          {
            name: "className",
            type: "string",
            description: "The class name to apply to the field",
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
