"use client";

import {
  form,
  formTextareaField,
  button,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exampleCode = `formTextareaField({
  name: "description",
  label: "Description",
  rows: 4,
  placeholder: "Enter your description here...",
  required: true,
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Form Textarea Field" }),
      text({
        content:
          "Form Textarea Field is a component that displays a multi-line text input field within a form.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              form({
                onSubmit: (data) => console.log(data),
                children: [
                  formTextareaField({
                    name: "description",
                    label: "Description",
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
            type: "string",
            description: "The default value for the field",
          },
          {
            name: "rows",
            type: "number",
            description: "The number of visible text lines",
          },
          {
            name: "placeholder",
            type: "string",
            description: "The placeholder text when the field is empty",
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
            name: "minLength",
            type: "number",
            description: "The minimum length of the text",
          },
          {
            name: "maxLength",
            type: "number",
            description: "The maximum length of the text",
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
