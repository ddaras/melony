"use client";

import {
  form,
  formPasswordField,
  button,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exampleCode = `formPasswordField({
  name: "password",
  label: "Password",
  required: true,
  minLength: 8,
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Form Password Field" }),
      text({
        content:
          "Form Password Field is a component that displays a password input field within a form.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              form({
                onSubmit: (data) => console.log(data),
                children: [
                  formPasswordField({
                    name: "password",
                    label: "Password",
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
            description: "The minimum length of the password",
          },
          {
            name: "maxLength",
            type: "number",
            description: "The maximum length of the password",
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
