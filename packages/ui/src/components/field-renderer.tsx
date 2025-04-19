import { FieldConfig } from "@/lib/types/fields";
import { TextFormField } from "./form-fields/text-form-field";
import { TextareaFormField } from "./form-fields/textarea-form-field";
import { NumberFormField } from "./form-fields/number-form-field";
import { DateFormField } from "./form-fields/date-form-field";
import { SelectFormField } from "./form-fields/select-form-field";
import { BooleanFormField } from "./form-fields/boolean-form-field";
import { UploadFormField } from "./form-fields/upload-form-field";
import { PasswordFormField } from "./form-fields/password-form-field";
import { ComboboxFormField } from "./form-fields/combobox-form-field";
import { JsonFormField } from "./form-fields/json-form-field";
import { ObjectFormField } from "./form-fields/object-form-field";
import { ArrayFormField } from "./form-fields/array-form-field";

interface FieldRendererProps {
  field: FieldConfig;
  data?: Record<string, unknown>;
  mode: "read" | "edit";
}

export const FieldRenderer = ({ field, mode }: FieldRendererProps) => {
  const renderReadMode = () => {
    switch (field.type) {
      default:
        return <></>;
    }
  };

  const renderEditMode = () => {
    switch (field.type) {
      case "text":
        return <TextFormField field={field} />;
      case "password":
        return <PasswordFormField field={field} />;
      case "textarea":
        return <TextareaFormField field={field} />;
      case "number":
        return <NumberFormField field={field} />;
      case "date":
        return <DateFormField field={field} />;
      case "select":
        return <SelectFormField field={field} />;
      case "boolean":
        return <BooleanFormField field={field} />;
      case "upload":
        return <UploadFormField field={field} />;
      case "combobox":
        return <ComboboxFormField field={field} />;
      case "json":
        return <JsonFormField field={field} />;
      case "object":
        return <ObjectFormField field={field} />;
      case "array":
        return <ArrayFormField field={field} />;
      default:
        return null;
    }
  };

  return mode === "read" ? renderReadMode() : renderEditMode();
};
