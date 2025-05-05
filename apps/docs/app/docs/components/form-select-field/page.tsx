"use client";

import {
  form,
  formSelectField,
  button,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exampleCode = `formSelectField({
  name: "country",
  label: "Country",
  options: [
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
    { label: "United Kingdom", value: "UK" },
  ],
  required: true,
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Form Select Field" }),
      text({
        content:
          "Form Select Field is a component that displays a dropdown select input field within a form.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              form({
                onSubmit: (data) => console.log(data),
                children: [
                  formSelectField({
                    name: "country",
                    label: "Country",
                    options: [
                      { label: "United States", value: "US" },
                      { label: "Canada", value: "CA" },
                      { label: "United Kingdom", value: "UK" },
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
            description: "The label text for the field",
          },
          {
            name: "options",
            type: "Array<{ label: string; value: string }>",
            description: "The options to display in the select field",
          },
          {
            name: "defaultValue",
            type: "string",
            description: "The default value for the field",
          },
          {
            name: "required",
            type: "boolean",
            description: "Whether the field is required",
          },
          {
            name: "disabled",
            type: "boolean",
            description: "Whether the field is disabled",
          },
          {
            name: "placeholder",
            type: "string",
            description: "The placeholder text when no option is selected",
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
