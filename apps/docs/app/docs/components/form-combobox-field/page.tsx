"use client";

import {
  form,
  formComboboxField,
  button,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exampleCode = `formComboboxField({
  name: "country",
  label: "Country",
  options: [
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
  ],
  onSearch: (value) => console.log(value),
  isLoading: false,
  className: "w-full",
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Form Combobox Field" }),
      text({
        content:
          "Form Combobox Field is a component that displays a combobox input field within a form.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              form({
                onSubmit: (data) => console.log(data),
                children: [
                  formComboboxField({
                    name: "country",
                    label: "Country",
                    options: [
                      { label: "United States", value: "US" },
                      { label: "Canada", value: "CA" },
                    ],
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
            name: "options",
            type: "Array<{ label: string; value: string }>",
            description: "The options to display in the combobox",
          },
          {
            name: "onSearch",
            type: "(value: string) => void",
            description: "Function to call when searching in the combobox",
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
