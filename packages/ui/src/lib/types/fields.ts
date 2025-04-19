export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "boolean"
  | "textarea"
  | "combobox"
  | "upload"
  | "password"
  | "image"
  | "json"
  | "icon"
  | "object"
  | "array"
  | "badge"
  | "rich-text"
  | "details"
  | "list";

export interface BaseFieldConfig {
  id?: string;
  type: FieldType;
  name: string;
  label?: string;
  evaluateValue?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;

  transform?: string;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text";
  config?: {
    truncate?: boolean;
    placeholder?: string;
    maxLength?: number;
  };
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  config?: {
    min?: number;
    max?: number;
    step?: number;
  };
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  config?: {
    format?: "MM/dd/yyyy" | "dd/MM/yyyy" | "yyyy-MM-dd";
    hasTime?: boolean;
    minDate?: Date;
    maxDate?: Date;
  };
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  config?: {
    options: Array<{ label: string; value: string }>;
    query?: string;
    optionsDataKey?: string;
  };
}

export interface BooleanFieldConfig extends BaseFieldConfig {
  type: "boolean";
  config?: Record<string, never>;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  config?: {
    placeholder?: string;
    maxLength?: number;
  };
}

export interface ComboboxFieldConfig extends BaseFieldConfig {
  type: "combobox";
  config?: {
    query?: string;
    displayField?: string;
    options?: Array<{ label: string; value: string }>;
  };
}

export interface UploadFieldConfig extends BaseFieldConfig {
  type: "upload";
  config?: {
    mutation?: string;
    bucket: string;
    accept?: string[];
    multiple?: boolean;
    maxSize?: number;
    maxFiles?: number;
  };
}

export interface PasswordFieldConfig extends BaseFieldConfig {
  type: "password";
  config?: {
    placeholder?: string;
    maxLength?: number;
  };
}

export interface ImageFieldConfig extends BaseFieldConfig {
  type: "image";
  config?: {
    placeholder?: string;
    baseImageUrl?: string;
    large?: boolean;
  };
}

export interface JsonFieldConfig extends BaseFieldConfig {
  type: "json";
  config?: Record<string, never>;
}

export interface IconFieldConfig extends BaseFieldConfig {
  type: "icon";
  config?: {
    defaultIcon?: string;
  };
}

export interface ObjectFieldConfig extends BaseFieldConfig {
  type: "object";
  config?: {
    fields?: FieldConfig[];
    tabs?: {
      label: string;
      fields: FieldConfig[];
    }[];
  };
}

export interface ArrayFieldConfig extends BaseFieldConfig {
  type: "array";
  config?: {
    fields: FieldConfig[];
  };
}

export interface BadgeFieldConfig extends BaseFieldConfig {
  type: "badge";
  config?: {
    color?: "default" | "primary" | "secondary" | "destructive" | "outline";
    colorKey?: string;
    colorMap?: Record<
      string,
      "default" | "primary" | "secondary" | "destructive" | "outline"
    >;
    colorTypes?: Record<string, string>;
    placeholder?: string;
    maxLength?: number;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}

export interface RichTextFieldConfig extends BaseFieldConfig {
  type: "rich-text";
  config?: {
    placeholder?: string;
  };
}

export interface DetailsFieldConfig extends BaseFieldConfig {
  type: "details";
  config?: {
    fields: FieldConfig[];
  };
}

export interface ListFieldConfig extends BaseFieldConfig {
  type: "list";
  config?: {
    fields: FieldConfig[];
    groupBy?: string;
  };
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | DateFieldConfig
  | SelectFieldConfig
  | BooleanFieldConfig
  | TextareaFieldConfig
  | ComboboxFieldConfig
  | UploadFieldConfig
  | PasswordFieldConfig
  | ImageFieldConfig
  | JsonFieldConfig
  | IconFieldConfig
  | ObjectFieldConfig
  | ArrayFieldConfig
  | BadgeFieldConfig
  | RichTextFieldConfig
  | DetailsFieldConfig
  | ListFieldConfig;
