import {
  FormBooleanFieldConfig,
  FormComboboxFieldConfig,
  FormDateFieldConfig,
  FormNumberFieldConfig,
  FormPasswordFieldConfig,
  FormSelectFieldConfig,
  FormTextareaFieldConfig,
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

export const formBooleanField = (
  config?: Omit<FormBooleanFieldConfig, "type">
) => {
  return renderUI({
    type: "form-boolean-field",
    name: config?.name || "fieldName",
    ...config,
  });
};

export const formNumberField = (
  config?: Omit<FormNumberFieldConfig, "type">
) => {
  return renderUI({
    type: "form-number-field",
    name: config?.name || "fieldName",
    ...config,
  });
};

export const formPasswordField = (
  config?: Omit<FormPasswordFieldConfig, "type">
) => {
  return renderUI({
    type: "form-password-field",
    name: config?.name || "fieldName",
    ...config,
  });
};

export const formSelectField = (
  config?: Omit<FormSelectFieldConfig, "type">
) => {
  return renderUI({
    type: "form-select-field",
    name: config?.name || "fieldName",
    ...config,
  });
};

export const formTextareaField = (
  config?: Omit<FormTextareaFieldConfig, "type">
) => {
  return renderUI({
    type: "form-textarea-field",
    name: config?.name || "fieldName",
    ...config,
  });
};
