import {
  FormFieldConfig,
  FormComboboxFieldConfig,
  FormDateFieldConfig,
} from "../builder/types";
import { FieldType } from "@melony/ui";
import { renderUI } from "../render/ui";

export const formField = (
  name: string,
  type: FieldType = "text",
  config?: Omit<FormFieldConfig, "type">
) => {
  return renderUI({
    type: "form-field",
    field: {
      type,
      name,
      ...config?.field,
    },
    ...config,
  });
};

export const formTextField = (
  name: string,
  config?: Omit<FormFieldConfig, "type">
) => {
  return formField(name, "text", config);
};

export const formComboboxField = (
  name: string,
  config?: Omit<FormComboboxFieldConfig, "type">
) => {
  return renderUI({
    type: "form-combobox-field",
    name,
    ...config,
  });
};

export const formDateField = (
  name: string,
  config?: Omit<FormDateFieldConfig, "type" | "name">
) => {
  return renderUI({
    type: "form-date-field",
    name,
    ...config,
  });
};
