"use client";

import {
  form,
  formTextField,
  formComboboxField,
  formDateField,
  button,
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
} from "melony";

const exampleCode = `form({
  onSubmit: (data) => console.log(data),
  children: [
    formTextField({
      name: "name",
      label: "Name",
    }),
    formComboboxField({
      name: "country",
      label: "Country",
      options: [
        { label: "United States", value: "US" },
        { label: "Canada", value: "CA" },
      ],
    }),
    formDateField({
      name: "birthday",
      label: "Birthday",
    }),
    button({
      label: "Submit",
      submit: true,
    }),
  ],
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Form" }),
      text({
        content:
          "Form is a component that displays a form with various input fields.",
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
                  formComboboxField({
                    name: "country",
                    label: "Country",
                    options: [
                      { label: "United States", value: "US" },
                      { label: "Canada", value: "CA" },
                    ],
                  }),
                  formDateField({
                    name: "birthday",
                    label: "Birthday",
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
            name: "onSubmit",
            type: "(data: Record<string, any>) => void",
            description: "The function to call when the form is submitted",
          },
          {
            name: "children",
            type: "ReactNode[]",
            description: "The form fields and buttons to display",
          },
          {
            name: "defaultValues",
            type: "Record<string, any>",
            description: "The default values for the form fields",
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
