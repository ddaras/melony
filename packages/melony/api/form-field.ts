import {
  FormComboboxFieldConfig,
  FormDateFieldConfig,
  FormTextFieldConfig,
} from "../builder/types";
import { renderUI } from "../render/ui";

export const formTextField = (
  name: string,
  config?: Omit<FormTextFieldConfig, "type">
) => {
  return renderUI({
    type: "form-text-field",
    name,
    ...config,
  });
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
