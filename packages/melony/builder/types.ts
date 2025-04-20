import {
  ColumnDef,
  FieldConfig,
  UseMutationResult,
  UseQueryResult,
} from "@melony/ui";

export type StackConfig = {
  type: "stack";
  direction: "row" | "col";
  gap?: number;
  padding?: number;
  className?: string;
  children?: React.ReactNode[];
};

export type TableConfig = {
  type: "table";
  data?: any[];
  columns?: ColumnDef<any>[];
};

export type ColumnConfig = {
  key: string;
  label?: string;
};

export type RootConfig = {
  type: "root";
  shouldRenderHtml?: boolean;
  className?: string;
  children?: React.ReactNode[];
};

export type FormConfig = {
  type: "form";
  onSubmit?: (data: any) => any;
  defaultValues?: Record<string, any>;
  children: React.ReactNode[];
};

export type TabsConfig = {
  type: "tabs";
  tabs: TabConfig[];
  className?: string;
};

export type TabConfig = {
  label: string;
  disabled?: boolean;
  content: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
};

export type FormFieldConfig = {
  type: "form-field";
  field: FieldConfig;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
};

export type FormComboboxFieldConfig = {
  type: "form-combobox-field";
  name: string;
  label?: string;
  options?: {
    label: string;
    value: string;
  }[];
  onSearch?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
};

export type FormDateFieldConfig = {
  type: "form-date-field";
  name: string;
  label?: string;
  isLoading?: boolean;
  className?: string;
};

export type ButtonConfig = {
  type: "button";
  label: string;
  submit?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  isLoading?: boolean;
};

export type MutationConfig = {
  type: "mutation";
  mutationKey?: string;
  action: (data: any) => Promise<any>;
  render: (mutation: UseMutationResult<any, any, any>) => React.ReactNode;
};

export type QueryConfig = {
  type: "query";
  queryKey?: string;
  action: (data: any) => Promise<any>;
  render: (query: UseQueryResult<any, any>) => React.ReactNode;
};

export type TextConfig = {
  type: "text";
  content: string;
  className?: string;
};

export type HeadingConfig = {
  type: "heading";
  content: string;
  level: 1 | 2 | 3 | 4;
  className?: string;
};

export type AvatarConfig = {
  type: "avatar";
  src: string;
  name?: string;
  className?: string;
};

export type UIConfig =
  | StackConfig
  | TableConfig
  | FormConfig
  | RootConfig
  | FormConfig
  | TabsConfig
  | FormFieldConfig
  | ButtonConfig
  | MutationConfig
  | QueryConfig
  | TextConfig
  | HeadingConfig
  | FormComboboxFieldConfig
  | FormDateFieldConfig
  | AvatarConfig;

export type UiBuilder = {
  build(): UIConfig;
  render(): React.ReactNode;
};
