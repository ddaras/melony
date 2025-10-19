import { ActionDefinition } from "../types";
import { ICONS } from "../icons";
import { CSSProperties, HTMLInputTypeAttribute } from "react";
import { Color, FontSize, FontWeight, Spacing } from "../theme";

// Common types
type Size = "sm" | "md" | "lg";
type Align = "start" | "center" | "end" | "stretch";
type Justify = "start" | "center" | "end" | "between" | "around";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";
type Background = CSSProperties["background"];
type Orientation = "horizontal" | "vertical";

type RowOrColContent =
  | SpacerProps
  | DividerProps
  | ImageProps
  | IconProps
  | BadgeProps
  | TextProps
  | HeadingProps
  | InputProps
  | TextareaProps
  | SelectProps
  | CheckboxProps
  | RadioGroupProps
  | ButtonProps
  | FormProps
  | LabelProps
  | RowProps
  | ColProps
  | ListProps;

// Container Component Props
// This is the only root component. Always start with Card.
export interface CardProps {
  children?: RowOrColContent[];
  title?: string;
  subtitle?: string;
  size?: Size | "full";
  background?: Background;
}

// Layout Component Props
export type RowProps = {
  children?: RowOrColContent[];
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  flex?: number | string;
  gap?: Spacing;
};

export type ColProps = {
  children?: RowOrColContent[];
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  flex?: number | string;
  gap?: Spacing;
};

export interface SpacerProps {
  size?: Spacing;
  direction?: Orientation;
}

export interface DividerProps {
  orientation?: Orientation;
  size?: Size;
  color?: Color;
}

export interface ListProps {
  children: ListItemProps[];
}

export interface ListItemProps {
  children: RowOrColContent[];
  orientation?: Orientation;
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  onClickAction?: ActionDefinition;
}

// Content Component Props
export interface ImageProps {
  src: string;
  alt?: string;
  size?: Size;
}

export interface IconProps {
  name: keyof typeof ICONS;
  size?: Size;
  color?: Color;
}

export interface BadgeProps {
  value: string;
  variant?: Extract<
    Color,
    "primary" | "secondary" | "success" | "danger" | "warning"
  >;
  size?: Size;
}

// Typography Props
export interface TextProps {
  value: string;
  size?: FontSize;
  weight?: FontWeight;
  color?: Color;
  align?: Align;
}

export interface HeadingProps {
  value: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

// Form Component Props
export interface FormProps {
  children?: (
    | InputProps
    | TextareaProps
    | SelectProps
    | CheckboxProps
    | RadioGroupProps
    | ButtonProps
    | LabelProps
  )[];
  onSubmitAction?: ActionDefinition;
}

export interface InputProps {
  inputType?: HTMLInputTypeAttribute;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  onChangeAction?: ActionDefinition;
}

export interface ButtonProps {
  value: string;
  variant?: Extract<Color, "primary" | "secondary" | "success" | "danger">;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  onClickAction?: ActionDefinition;
}

export interface LabelProps {
  value: string;
  htmlFor?: string;
  required?: boolean;
  size?: FontSize;
  weight?: FontWeight;
}

export interface TextareaProps {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  rows?: number;
  onChangeAction?: ActionDefinition;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  defaultValue?: string;
  value?: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  onChangeAction?: ActionDefinition;
}

export interface CheckboxProps {
  label?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChangeAction?: ActionDefinition;
}

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  defaultValue?: string;
  value?: string;
  label?: string;
  disabled?: boolean;
  orientation?: Orientation;
  onChangeAction?: ActionDefinition;
}
