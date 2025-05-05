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
  navigate?: (path: string) => void;
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

export type FormTextFieldConfig = {
  type: "form-text-field";
  name: string;
  label?: string;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
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

export type NavigationButtonConfig = {
  type: "navigation-button";
  label: string;
  href?: string;
  className?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
};

export type MutationConfig = {
  type: "mutation";
  mutationKey?: string;
  action: (data: any) => Promise<any>;
  render: (mutation: UseMutationResult<any, any, any>) => React.ReactNode;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onSettled?: (data: any) => void;
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
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "caption";
  className?: string;
};

export type AvatarConfig = {
  type: "avatar";
  src?: string;
  name?: string;
  className?: string;
};

export type ChipConfig = {
  type: "chip";
  label: string;
  variant?: "default" | "outline";
  className?: string;
};

export type ModalButtonConfig = {
  type: "modal-button";
  label: string;
  title: string;
  content: ({ close }: { close: () => void }) => React.ReactNode;
  description?: string;
};

export type CodeBlockConfig = {
  type: "code-block";
  code: string;
  title?: string;
  lang?: string;
  className?: string;
  keepBackground?: boolean;
  allowCopy?: boolean;
};

export type ThemeToggleConfig = {
  type: "theme-toggle";
  className?: string;
};

export type CardConfig = {
  type: "card";
  title?: string;
  description?: string;
  children?: React.ReactNode[];
  className?: string;
};

export type SpacerConfig = {
  type: "spacer";
  content?: string;
  className?: string;
};

export type StepConfig = {
  title: string;
  description?: string;
  showConnector?: boolean;
};

export type StepperConfig = {
  type: "stepper";
  steps: StepConfig[];
  activeStep?: number;
  className?: string;
};

export type UIConfig =
  | StackConfig
  | TableConfig
  | FormConfig
  | RootConfig
  | FormConfig
  | TabsConfig
  | FormTextFieldConfig
  | ButtonConfig
  | MutationConfig
  | QueryConfig
  | TextConfig
  | HeadingConfig
  | FormComboboxFieldConfig
  | FormDateFieldConfig
  | AvatarConfig
  | NavigationButtonConfig
  | ChipConfig
  | ModalButtonConfig
  | CodeBlockConfig
  | ThemeToggleConfig
  | CardConfig
  | SpacerConfig
  | StepperConfig;

export type UiBuilder = {
  build(): UIConfig;
  render(): React.ReactNode;
};
