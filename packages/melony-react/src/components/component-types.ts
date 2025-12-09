import React from "react";
import { ICONS } from "../icons";
import { CSSProperties, HTMLInputTypeAttribute } from "react";
import { Color, FontSize, FontWeight, Spacing } from "../theme";
import { MelonyEvent } from "@melony/core/browser";

// Common types
type Size = "sm" | "md" | "lg";
type Align = "start" | "center" | "end" | "stretch";
type Justify = "start" | "center" | "end" | "between" | "around";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";
type Background = CSSProperties["background"];
type Orientation = "horizontal" | "vertical";

interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
}

// Container Component Props
// This is the only root component. Always start with Card.
export interface CardProps extends BaseComponentProps {
  children?: React.ReactNode[];
  title?: string;
  subtitle?: string;
  background?: Background;
  isLoading?: boolean;
}

// Layout Component Props
export interface RowProps extends BaseComponentProps {
  children?: React.ReactNode[];
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  flex?: number | string;
  gap?: Spacing;
}

export interface ColProps extends BaseComponentProps {
  children?: React.ReactNode[] | React.ReactNode;
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  flex?: number | string;
  gap?: Spacing;
  width?: string | number;
  height?: string | number;
  padding?: Spacing;
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
}

export interface BoxProps extends BaseComponentProps {
  children?: React.ReactNode | React.ReactNode[];
  padding?: Spacing;
  margin?: string | number;
  background?: Background;
  border?: boolean;
  borderRadius?: Spacing;
  width?: string | number;
  height?: string | number;
  overflow?: "visible" | "hidden" | "scroll" | "auto";
}

export interface SpacerProps extends BaseComponentProps {
  size?: Spacing;
  direction?: Orientation;
}

export interface DividerProps extends BaseComponentProps {
  orientation?: Orientation;
  size?: Size;
  color?: Color;
}

export interface ListProps extends BaseComponentProps {
  children?: React.ReactNode;
  width?: string | number;
}

export interface ListItemProps extends BaseComponentProps {
  children?: React.ReactNode;
  orientation?: Orientation;
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  onClickAction?: MelonyEvent;
  width?: string | number;
  padding?: Spacing;
}

// Content Component Props
export interface ImageProps extends BaseComponentProps {
  src: string;
  alt?: string;
  size?: Size;
  fallbackText?: string;
  showFallbackIcon?: boolean;
}

export interface IconProps extends BaseComponentProps {
  name: keyof typeof ICONS;
  size?: Size;
  color?: Color;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: Color;
}

export interface ChartProps extends BaseComponentProps {
  data: ChartDataPoint[];
  chartType?: "bar" | "line" | "area" | "pie";
  size?: Size;
  showValues?: boolean;
  showGrid?: boolean;
  showTooltips?: boolean;
}

export interface BadgeProps extends BaseComponentProps {
  label?: string;
  variant?: Extract<
    Color,
    "primary" | "secondary" | "success" | "danger" | "warning"
  >;
  size?: Size;
}

// Typography Props
export interface TextProps extends BaseComponentProps {
  value: string;
  size?: FontSize;
  weight?: FontWeight;
  color?: Color;
  align?: Align;
}

export interface HeadingProps extends BaseComponentProps {
  value: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

// Form Component Props
export interface FormProps extends BaseComponentProps {
  children?: React.ReactNode[];
  onSubmitAction?: MelonyEvent;
}

export interface InputProps extends BaseComponentProps {
  inputType?: HTMLInputTypeAttribute;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  onChangeAction?: MelonyEvent;
}

export interface ButtonProps extends BaseComponentProps {
  label?: string;
  variant?:
    | Extract<Color, "primary" | "secondary" | "success" | "danger">
    | "outline";
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  onClickAction?: MelonyEvent;
}

export interface LabelProps extends BaseComponentProps {
  value: string;
  htmlFor?: string;
  required?: boolean;
  size?: FontSize;
  weight?: FontWeight;
  style?: CSSProperties;
}

export interface TextareaProps extends BaseComponentProps {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  rows?: number;
  onChangeAction?: MelonyEvent;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  defaultValue?: string;
  value?: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  onChangeAction?: MelonyEvent;
}

export interface CheckboxProps extends BaseComponentProps {
  label?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChangeAction?: MelonyEvent;
}

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends BaseComponentProps {
  name: string;
  options: RadioOption[];
  defaultValue?: string;
  value?: string;
  label?: string;
  disabled?: boolean;
  orientation?: Orientation;
  onChangeAction?: MelonyEvent;
}
