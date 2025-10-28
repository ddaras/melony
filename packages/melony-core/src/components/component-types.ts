import React from "react";
import { ICONS } from "../icons";
import { CSSProperties, HTMLInputTypeAttribute } from "react";
import { Color, FontSize, FontWeight, Spacing } from "../theme";
import { Action } from "../types";
import { ComponentDef } from "../renderer";

// Common types
type Size = "sm" | "md" | "lg";
type Align = "start" | "center" | "end" | "stretch";
type Justify = "start" | "center" | "end" | "between" | "around";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";
type Background = CSSProperties["background"];
type Orientation = "horizontal" | "vertical";

// Container Component Props
// This is the only root component. Always start with Card.
export interface CardProps {
  children?: React.ReactNode[];
  title?: string;
  subtitle?: string;
  background?: Background;
  isLoading?: boolean;
}

// Layout Component Props
export type RowProps = {
  children?: React.ReactNode[];
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  flex?: number | string;
  gap?: Spacing;
};

export type ColProps = {
  children?: React.ReactNode[];
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  flex?: number | string;
  gap?: Spacing;
};

export interface BoxProps {
  children?: React.ReactNode[];
  padding?: Spacing;
  margin?: Spacing;
  background?: Background;
  border?: boolean;
  borderRadius?: Spacing;
  width?: string | number;
  height?: string | number;
  overflow?: "visible" | "hidden" | "scroll" | "auto";
}

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
  children: React.ReactNode[];
  orientation?: Orientation;
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  onClickAction?: Action;
}

// Content Component Props
export interface ImageProps {
  src: string;
  alt?: string;
  size?: Size;
  fallbackText?: string;
  showFallbackIcon?: boolean;
}

export interface IconProps {
  name: keyof typeof ICONS;
  size?: Size;
  color?: Color;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: Color;
}

export interface ChartProps {
  data: ChartDataPoint[];
  chartType?: "bar" | "line" | "area" | "pie";
  size?: Size;
  showValues?: boolean;
  showGrid?: boolean;
  showTooltips?: boolean;
}

export interface BadgeProps {
  label?: string;
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
  children?: React.ReactNode[];
  onSubmitAction?: Action;
}

export interface InputProps {
  inputType?: HTMLInputTypeAttribute;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  onChangeAction?: Action;
}

export interface ButtonProps {
  label?: string;
  variant?: Extract<Color, "primary" | "secondary" | "success" | "danger">;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  onClickAction?: Action;
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
  onChangeAction?: Action;
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
  onChangeAction?: Action;
}

export interface CheckboxProps {
  label?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChangeAction?: Action;
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
  onChangeAction?: Action;
}

// Note: ForProps and IfProps removed - control flow is now handled 
// natively by TemplateEngine via {{#condition}} and {{#array}} syntax
