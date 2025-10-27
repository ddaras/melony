/**
 * Builder Helper Functions
 * Type-safe functions for building Melony components
 */

import {
  BuilderNode,
  Spacing,
  Align,
  Justify,
  Wrap,
  TextSize,
  FontWeight,
  ColorVariant,
  ButtonVariant,
  ButtonSize,
  CardSize,
  ImageSize,
  IconSize,
  Orientation,
  InputType,
  ChartType,
  HeadingLevel,
  ActionDef,
} from "./types";

/**
 * Helper to create a builder node
 */
function createNode(
  component: string,
  props: Record<string, any> = {},
  children?: BuilderNode | BuilderNode[]
): BuilderNode {
  const node: BuilderNode = {
    _type: "builder-node",
    component,
    props,
  };

  if (children !== undefined) {
    node.children = Array.isArray(children) ? children : [children];
  }

  return node;
}

/**
 * Helper to convert action to JSON string
 */
function actionToString(action: ActionDef | string): string {
  if (typeof action === "string") {
    return action;
  }
  return JSON.stringify(action);
}

// ============================================================================
// CONTAINER COMPONENTS
// ============================================================================

export interface CardProps {
  title?: string;
  subtitle?: string;
  size?: CardSize;
  isLoading?: boolean;
}

/**
 * Card - Root container component (all UIs must start with Card)
 */
export function card(props: CardProps, children?: BuilderNode | BuilderNode[]): BuilderNode {
  return createNode("Card", props, children);
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

export interface RowProps {
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  flex?: number | string;
}

/**
 * Row - Horizontal flex container
 */
export function row(props: RowProps = {}, children?: BuilderNode | BuilderNode[]): BuilderNode {
  return createNode("Row", props, children);
}

export interface ColProps {
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  flex?: number | string;
}

/**
 * Col - Vertical flex container
 */
export function col(props: ColProps = {}, children?: BuilderNode | BuilderNode[]): BuilderNode {
  return createNode("Col", props, children);
}

export interface BoxProps {
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  direction?: "row" | "column";
  wrap?: Wrap;
  flex?: number | string;
}

/**
 * Box - Generic container with flex properties
 */
export function box(props: BoxProps = {}, children?: BuilderNode | BuilderNode[]): BuilderNode {
  return createNode("Box", props, children);
}

/**
 * List - List container
 */
export function list(children: BuilderNode | BuilderNode[]): BuilderNode {
  return createNode("List", {}, children);
}

export interface ListItemProps {
  orientation?: Orientation;
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  onClickAction?: ActionDef | string;
}

/**
 * ListItem - Individual list items with built-in flex layout
 */
export function listItem(props: ListItemProps = {}, children?: BuilderNode | BuilderNode[]): BuilderNode {
  const processedProps = { ...props };
  if (props.onClickAction) {
    processedProps.onClickAction = actionToString(props.onClickAction);
  }
  return createNode("ListItem", processedProps, children);
}

// ============================================================================
// TYPOGRAPHY COMPONENTS
// ============================================================================

export interface TextProps {
  value: string;
  size?: TextSize;
  weight?: FontWeight;
  color?: ColorVariant | string;
  align?: Align;
  flex?: number | string;
}

/**
 * Text - Styled text element
 */
export function text(props: TextProps): BuilderNode {
  return createNode("Text", props);
}

export interface HeadingProps {
  value: string;
  level?: HeadingLevel;
}

/**
 * Heading - Semantic heading element (h1-h6)
 */
export function heading(props: HeadingProps): BuilderNode {
  return createNode("Heading", props);
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

export interface InputProps {
  inputType?: InputType;
  placeholder?: string;
  label?: string;
  name?: string;
  defaultValue?: string;
  onChangeAction?: ActionDef | string;
}

/**
 * Input - Text input field
 */
export function input(props: InputProps): BuilderNode {
  const processedProps = { ...props };
  if (props.onChangeAction) {
    processedProps.onChangeAction = actionToString(props.onChangeAction);
  }
  return createNode("Input", processedProps);
}

export interface TextareaProps {
  placeholder?: string;
  label?: string;
  name?: string;
  rows?: number;
  defaultValue?: string;
  onChangeAction?: ActionDef | string;
}

/**
 * Textarea - Multi-line text input
 */
export function textarea(props: TextareaProps): BuilderNode {
  const processedProps = { ...props };
  if (props.onChangeAction) {
    processedProps.onChangeAction = actionToString(props.onChangeAction);
  }
  return createNode("Textarea", processedProps);
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  name?: string;
  defaultValue?: string;
  onChangeAction?: ActionDef | string;
}

/**
 * Select - Dropdown selection menu
 */
export function select(props: SelectProps): BuilderNode {
  const processedProps = { ...props };
  if (props.onChangeAction) {
    processedProps.onChangeAction = actionToString(props.onChangeAction);
  }
  return createNode("Select", processedProps);
}

export interface CheckboxProps {
  label?: string;
  name?: string;
  defaultChecked?: boolean;
  onChangeAction?: ActionDef | string;
}

/**
 * Checkbox - Single checkbox
 */
export function checkbox(props: CheckboxProps): BuilderNode {
  const processedProps = { ...props };
  if (props.onChangeAction) {
    processedProps.onChangeAction = actionToString(props.onChangeAction);
  }
  return createNode("Checkbox", processedProps);
}

export interface RadioGroupProps {
  options: SelectOption[];
  name: string;
  label?: string;
  orientation?: Orientation;
  defaultValue?: string;
  onChangeAction?: ActionDef | string;
}

/**
 * RadioGroup - Radio button group
 */
export function radioGroup(props: RadioGroupProps): BuilderNode {
  const processedProps = { ...props };
  if (props.onChangeAction) {
    processedProps.onChangeAction = actionToString(props.onChangeAction);
  }
  return createNode("RadioGroup", processedProps);
}

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  onClickAction?: ActionDef | string;
}

/**
 * Button - Interactive button
 */
export function button(props: ButtonProps): BuilderNode {
  const processedProps = { ...props };
  if (props.onClickAction) {
    processedProps.onClickAction = actionToString(props.onClickAction);
  }
  return createNode("Button", processedProps);
}

export interface FormProps {
  onSubmitAction?: ActionDef | string;
}

/**
 * Form - Form container with submission handling
 */
export function form(props: FormProps = {}, children?: BuilderNode | BuilderNode[]): BuilderNode {
  const processedProps = { ...props };
  if (props.onSubmitAction) {
    processedProps.onSubmitAction = actionToString(props.onSubmitAction);
  }
  return createNode("Form", processedProps, children);
}

export interface LabelProps {
  text: string;
  htmlFor?: string;
}

/**
 * Label - Form field label
 */
export function label(props: LabelProps): BuilderNode {
  return createNode("Label", props);
}

// ============================================================================
// CONTENT COMPONENTS
// ============================================================================

export interface ImageProps {
  src: string;
  alt?: string;
  size?: ImageSize;
}

/**
 * Image - Image with responsive sizing
 */
export function image(props: ImageProps): BuilderNode {
  return createNode("Image", props);
}

export interface IconProps {
  name: string;
  size?: IconSize;
  color?: ColorVariant | string;
}

/**
 * Icon - Icon from built-in set
 */
export function icon(props: IconProps): BuilderNode {
  return createNode("Icon", props);
}

export interface BadgeProps {
  label: string;
  variant?: ColorVariant;
}

/**
 * Badge - Small badge for status indicators
 */
export function badge(props: BadgeProps): BuilderNode {
  return createNode("Badge", props);
}

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

export interface SpacerProps {
  size?: Spacing;
  height?: string | number;
  width?: string | number;
}

/**
 * Spacer - Invisible spacing element
 */
export function spacer(props: SpacerProps = {}): BuilderNode {
  return createNode("Spacer", props);
}

export interface DividerProps {
  orientation?: Orientation;
}

/**
 * Divider - Visual separator line
 */
export function divider(props: DividerProps = {}): BuilderNode {
  return createNode("Divider", props);
}

// ============================================================================
// DATA VISUALIZATION COMPONENTS
// ============================================================================

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartProps {
  type: ChartType;
  data: ChartDataPoint[];
  xKey?: string;
  yKeys?: string[];
  title?: string;
  height?: number;
}

/**
 * Chart - Interactive charts (line, bar, pie, area)
 */
export function chart(props: ChartProps): BuilderNode {
  return createNode("Chart", props);
}

// ============================================================================
// CONTROL FLOW COMPONENTS
// ============================================================================

export interface ForProps {
  items: any[];
}

/**
 * For - Render arrays with template support
 */
export function forLoop(props: ForProps, children: BuilderNode | BuilderNode[]): BuilderNode {
  return createNode("For", props, children);
}

export interface WidgetProps {
  type: string;
  [key: string]: any;
}

/**
 * Widget - Render custom widget templates
 */
export function widget(props: WidgetProps): BuilderNode {
  return createNode("Widget", props);
}

