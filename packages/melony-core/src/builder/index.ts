/**
 * Melony Builder API
 * Type-safe JSX-like API for building widgets
 */

// Export types
export type {
  BuilderNode,
  BuilderResult,
  PropsWithChildren,
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
  WidgetDefinition,
  CompiledWidget,
  ActionDef,
} from "./types";

// Export builder functions
export {
  card,
  row,
  col,
  box,
  list,
  listItem,
  text,
  heading,
  input,
  textarea,
  select,
  checkbox,
  radioGroup,
  button,
  form,
  label,
  image,
  icon,
  badge,
  spacer,
  divider,
  chart,
  forLoop,
  widget,
  ifBlock,
} from "./helpers";

// Export prop types for each component
export type {
  CardProps,
  RowProps,
  ColProps,
  BoxProps,
  ListItemProps,
  TextProps,
  HeadingProps,
  InputProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
  RadioGroupProps,
  ButtonProps,
  FormProps,
  LabelProps,
  ImageProps,
  IconProps,
  BadgeProps,
  SpacerProps,
  DividerProps,
  ChartProps,
  ForProps,
  WidgetProps,
  SelectOption,
  ChartDataPoint,
  IfProps,
} from "./helpers";

// Export widget definition functions
export {
  defineWidget,
  zodSchemaToPrompt,
  compileWidgets,
  generateWidgetSystemPrompt,
} from "./define-widget";

export type { PromptConfig } from "./define-widget";

// Export compiler functions
export {
  compileToTemplate,
  prettyPrint,
  minifyTemplate,
  validateBuilderNode,
  extractComponents,
  calculateDepth,
  countNodes,
} from "./compiler";

// Export prompt functions
export { createWidgetPrompt } from "./prompts";
