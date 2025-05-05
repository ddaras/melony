"use client";

import {
  button,
  form,
  formTextField,
  formComboboxField,
  formDateField,
} from "melony";

export const exampleForm = form({
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
        { label: "Australia", value: "AU" },
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
});
