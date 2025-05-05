import {
  FormComboboxFieldConfig,
  FormDateFieldConfig,
  FormTextFieldConfig,
} from "../builder/types";
import { renderUI } from "../render/ui";

export const formTextField = (config?: Omit<FormTextFieldConfig, "type">) => {
  return renderUI({
    type: "form-text-field",
    name: config?.name || "fieldName",
    ...config,
  });
};

export const formComboboxField = (
  config?: Omit<FormComboboxFieldConfig, "type">
) => {
  return renderUI({
    type: "form-combobox-field",
    name: config?.name || "fieldName",
    ...config,
  });
};

export const formDateField = (config?: Omit<FormDateFieldConfig, "type">) => {
  return renderUI({
    type: "form-date-field",
    name: config?.name || "fieldName",
    ...config,
  });
};
