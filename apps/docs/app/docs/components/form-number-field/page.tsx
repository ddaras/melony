"use client";

import {
  form,
  formNumberField,
  button,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exampleCode = `formNumberField({
  name: "age",
  label: "Age",
  min: 0,
  max: 120,
  required: true,
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Form Number Field" }),
      text({
        content:
          "Form Number Field is a component that displays a number input field within a form.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              form({
                onSubmit: (data) => console.log(data),
                children: [
                  formNumberField({
                    name: "age",
                    label: "Age",
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
            name: "defaultValue",
            type: "number",
            description: "The default value for the field",
          },
          {
            name: "min",
            type: "number",
            description: "The minimum value allowed",
          },
          {
            name: "max",
            type: "number",
            description: "The maximum value allowed",
          },
          {
            name: "step",
            type: "number",
            description: "The step value for increment/decrement",
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
