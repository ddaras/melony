import React from "react";
import { CSSProperties } from "react";
import { Color, FontSize, FontWeight, Spacing } from "./theme";
import { UIContract } from "melony";

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
export type CardProps = BaseComponentProps &
  UIContract["card"] & {
    children?: React.ReactNode[];
  };

// Layout Component Props
export type RowProps = BaseComponentProps &
  UIContract["row"] & {
    children?: React.ReactNode[];
  };

export type ColProps = BaseComponentProps &
  UIContract["col"] & {
    children?: React.ReactNode[] | React.ReactNode;
    overflow?: "visible" | "hidden" | "scroll" | "auto";
    position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  };

export type BoxProps = BaseComponentProps &
  UIContract["box"] & {
    children?: React.ReactNode | React.ReactNode[];
    overflow?: "visible" | "hidden" | "scroll" | "auto";
  };

export type SpacerProps = BaseComponentProps & UIContract["spacer"];

export type DividerProps = BaseComponentProps &
  UIContract["divider"] & {
    size?: Size;
  };

export type ListProps = BaseComponentProps & {
  children?: React.ReactNode;
  width?: string | number;
};

export type ListItemProps = BaseComponentProps &
  UIContract["listItem"] & {
    children?: React.ReactNode;
    orientation?: Orientation;
    align?: Align;
    justify?: Justify;
    width?: string | number;
    padding?: Spacing;
  };

// Content Component Props
export type ImageProps = BaseComponentProps &
  UIContract["image"] & {
    fallbackText?: string;
    showFallbackIcon?: boolean;
  };

export type IconProps = BaseComponentProps & UIContract["icon"];

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: Color;
}

export type ChartProps = BaseComponentProps &
  UIContract["chart"] & {
    size?: Size;
    showValues?: boolean;
    showGrid?: boolean;
    showTooltips?: boolean;
  };

export type BadgeProps = BaseComponentProps & UIContract["badge"];

// Typography Props
export type TextProps = BaseComponentProps & UIContract["text"];

export type HeadingProps = BaseComponentProps & UIContract["heading"];

// Form Component Props
export type FormProps = BaseComponentProps &
  UIContract["form"] & {
    children?: React.ReactNode[];
  };

export type InputProps = BaseComponentProps &
  UIContract["input"] & {
    disabled?: boolean;
    value?: string;
  };

export type ButtonProps = BaseComponentProps &
  UIContract["button"] & {
    fullWidth?: boolean;
  };

export type LabelProps = BaseComponentProps &
  UIContract["label"] & {
    size?: FontSize;
    weight?: FontWeight;
  };

export type TextareaProps = BaseComponentProps &
  UIContract["textarea"] & {
    value?: string;
    disabled?: boolean;
  };

export interface SelectOption {
  label: string;
  value: string;
}

export type SelectProps = BaseComponentProps &
  UIContract["select"] & {
    value?: string;
    disabled?: boolean;
  };

export type CheckboxProps = BaseComponentProps &
  UIContract["checkbox"] & {
    defaultChecked?: boolean;
    disabled?: boolean;
  };

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type RadioGroupProps = BaseComponentProps &
  UIContract["radioGroup"] & {
    value?: string;
    defaultValue?: string;
    disabled?: boolean;
  };
