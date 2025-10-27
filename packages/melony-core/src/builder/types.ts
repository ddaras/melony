/**
 * Builder API Type Definitions
 * Provides type-safe interfaces for building Melony widgets
 */

import { z } from "zod";
import { WidgetTemplate } from "../widget-template";

/**
 * Base builder node - all components return this
 */
export interface BuilderNode {
  _type: "builder-node";
  component: string;
  props: Record<string, any>;
  children?: BuilderNode[];
}

/**
 * Builder result that can be compiled to template string
 */
export type BuilderResult = BuilderNode;

/**
 * Props with children support
 */
export type PropsWithChildren<P = {}> = P & {
  children?: BuilderNode | BuilderNode[];
};

/**
 * Spacing sizes
 */
export type Spacing = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Alignment options
 */
export type Align = "start" | "center" | "end" | "stretch";

/**
 * Justification options
 */
export type Justify = "start" | "center" | "end" | "between" | "around";

/**
 * Wrap options
 */
export type Wrap = "nowrap" | "wrap" | "wrap-reverse";

/**
 * Text sizes
 */
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/**
 * Font weights
 */
export type FontWeight = "normal" | "medium" | "semibold" | "bold";

/**
 * Color variants
 */
export type ColorVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "muted";

/**
 * Button variants
 */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

/**
 * Button sizes
 */
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Card sizes
 */
export type CardSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Image sizes
 */
export type ImageSize = "sm" | "md" | "lg";

/**
 * Icon sizes
 */
export type IconSize = "sm" | "md" | "lg";

/**
 * Orientation
 */
export type Orientation = "horizontal" | "vertical";

/**
 * Input types
 */
export type InputType = "text" | "email" | "password" | "number" | "tel" | "url" | "date" | "time" | "datetime-local";

/**
 * Chart types
 */
export type ChartType = "line" | "bar" | "pie" | "area";

/**
 * Heading levels
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Widget definition with schema
 */
export interface WidgetDefinition<TSchema extends z.ZodType = z.ZodType> {
  type: string;
  name?: string;
  description?: string;
  schema: TSchema;
  builder: (props: z.infer<TSchema>) => BuilderNode;
  examples?: z.infer<TSchema>[];
  defaultProps?: Partial<z.infer<TSchema>>;
}

/**
 * Compiled widget ready for use
 */
export interface CompiledWidget extends WidgetTemplate {
  prompt: string;
}

/**
 * Action definition
 */
export interface ActionDef {
  type: string;
  payload?: Record<string, any>;
}

