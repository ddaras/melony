import type { Event } from "melony";

// ─── Design Tokens ──────────────────────────────────────────────────────────────
// Platform-agnostic tokens that map to each renderer's design system.

export type UISize = "xs" | "sm" | "md" | "lg" | "xl";
export type UISpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type UIRadius = "none" | "sm" | "md" | "lg" | "full";
export type UIShadow = "none" | "sm" | "md" | "lg" | "xl";

export type UIColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "background"
  | "foreground"
  | "muted"
  | "mutedForeground"
  | "border"
  | "transparent"
  | (string & {});

export type UIWidth =
  | "auto"
  | "full"
  | "min"
  | "max"
  | "1/2"
  | "1/3"
  | "2/3"
  | "1/4"
  | "3/4"
  | number
  | (string & {});

export type UIAlign = "start" | "center" | "end" | "stretch";
export type UIJustify = "start" | "center" | "end" | "between" | "around";
export type UIWrap = "nowrap" | "wrap" | "wrap-reverse";
export type UIOrientation = "horizontal" | "vertical";
export type UIOverflow = "hidden" | "visible" | "scroll" | "auto";
export type UIFontWeight = "normal" | "medium" | "semibold" | "bold";
export type UITextAlign = "start" | "center" | "end";

// ─── Shared Prop Interfaces ─────────────────────────────────────────────────────
// Composable interfaces used by layout/container components.

interface UIBaseProps {
  id?: string;
}

interface UIFlexProps {
  align?: UIAlign;
  justify?: UIJustify;
  gap?: UISpacing;
  wrap?: UIWrap;
}

interface UIContainerProps {
  padding?: UISpacing;
  width?: UIWidth;
  maxWidth?: number | string;
  height?: "auto" | "full";
  flex?: number;
  overflow?: UIOverflow;
  background?: UIColor;
  border?: boolean;
  borderColor?: UIColor;
  radius?: UIRadius;
  shadow?: UIShadow;
}

// ─── UI Component Contract ──────────────────────────────────────────────────────

export interface UIContract {
  // ── Layout ──────────────────────────────────────────────────────────────────

  row: UIBaseProps & UIFlexProps & UIContainerProps & {
    group?: boolean;
  };

  col: UIBaseProps & UIFlexProps & UIContainerProps & {
    group?: boolean;
  };

  box: UIBaseProps & UIContainerProps & {
    margin?: UISpacing;
    group?: boolean;
    onClickAction?: Event;
  };

  spacer: UIBaseProps & {
    size?: UISpacing;
    direction?: UIOrientation;
  };

  divider: UIBaseProps & {
    orientation?: UIOrientation;
    color?: UIColor;
    margin?: UISpacing;
  };

  // ── Content ─────────────────────────────────────────────────────────────────

  text: UIBaseProps & {
    value: string;
    size?: UISize;
    weight?: UIFontWeight;
    color?: UIColor;
    align?: UITextAlign;
  };

  heading: UIBaseProps & {
    value: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    color?: UIColor;
    align?: UITextAlign;
  };

  markdown: UIBaseProps & {
    value: string;
    size?: UISize;
    color?: UIColor;
  };

  image: UIBaseProps & {
    src: string;
    alt?: string;
    width?: UIWidth;
    height?: string | number;
    radius?: UIRadius;
    objectFit?: "cover" | "contain" | "fill";
  };

  video: UIBaseProps & {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    aspectRatio?: "16/9" | "4/3" | "1/1" | "9/16";
    width?: UIWidth;
    height?: string | number;
    radius?: UIRadius;
  };

  icon: UIBaseProps & {
    name: string;
    size?: UISize | number;
    color?: UIColor;
  };

  // ── Interactive ─────────────────────────────────────────────────────────────

  button: UIBaseProps & {
    type?: "button" | "submit" | "reset";
    variant?:
      | "primary"
      | "secondary"
      | "success"
      | "danger"
      | "outline"
      | "ghost"
      | "link";
    size?: UISize;
    disabled?: boolean;
    width?: UIWidth;
    onClickAction?: Event;
    justify?: UIJustify;
    truncate?: boolean;
  };

  badge: UIBaseProps & {
    label: string;
    variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "outline";
    size?: UISize;
  };

  dropdown: UIBaseProps & {
    items?: Array<{
      label: string;
      icon?: string;
      onClickAction?: Event;
    }>;
  };

  popover: UIBaseProps & {
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
    modal?: boolean;
    trigger?: UINode;
  };

  // ── Forms ───────────────────────────────────────────────────────────────────

  form: UIBaseProps & {
    onSubmitAction?: Event | ((data: any) => Event);
    gap?: UISpacing;
  };

  input: UIBaseProps & {
    name: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    inputType?: "text" | "password" | "email" | "number" | "tel" | "url";
    onChangeAction?: Event;
    disabled?: boolean;
    required?: boolean;
    width?: UIWidth;
  };

  textarea: UIBaseProps & {
    name: string;
    placeholder?: string;
    defaultValue?: string;
    rows?: number;
    onChangeAction?: Event;
    onSubmitAction?: Event;
    submitOnEnter?: boolean;
    disabled?: boolean;
    required?: boolean;
    width?: UIWidth;
  };

  select: UIBaseProps & {
    name: string;
    label?: string;
    options: Array<{ label: string; value: string }>;
    defaultValue?: string;
    placeholder?: string;
    onChangeAction?: Event;
    disabled?: boolean;
    required?: boolean;
    width?: UIWidth;
  };

  checkbox: UIBaseProps & {
    name: string;
    label?: string;
    checked?: boolean;
    onChangeAction?: Event;
    disabled?: boolean;
  };

  radioGroup: UIBaseProps & {
    name: string;
    options: Array<{ label: string; value: string; disabled?: boolean }>;
    label?: string;
    defaultValue?: string;
    orientation?: UIOrientation;
    onChangeAction?: Event;
    disabled?: boolean;
  };

  label: UIBaseProps & {
    value: string;
    required?: boolean;
    size?: UISize;
    color?: UIColor;
  };

  hidden: UIBaseProps & {
    name: string;
    value: string;
  };

  colorPicker: UIBaseProps & {
    name: string;
    label?: string;
    defaultValue?: string;
    onChangeAction?: Event;
    disabled?: boolean;
  };

  upload: UIBaseProps & {
    label?: string;
    multiple?: boolean;
    accept?: string;
    initialFiles?: { name: string; url: string }[];
    onUploadAction?: Event | ((data: any) => Event);
    mode?: "append" | "replace";
    disabled?: boolean;
  };

  // ── Positioning ─────────────────────────────────────────────────────────────

  float: UIBaseProps & {
    position?:
      | "top-left"
      | "top-right"
      | "top-center"
      | "bottom-left"
      | "bottom-right"
      | "bottom-center"
      | "center"
      | "left-center"
      | "right-center";
    offsetX?: UISpacing;
    offsetY?: UISpacing;
    showOnHover?: boolean;
  };

  sticky: UIBaseProps & {
    top?: UISpacing | number;
    bottom?: UISpacing | number;
    left?: UISpacing | number;
    right?: UISpacing | number;
    zIndex?: number;
    background?: UIColor;
    padding?: UISpacing;
    width?: UIWidth;
    maxWidth?: number | string;
  };

  // ── Compound ────────────────────────────────────────────────────────────────

  card: UIBaseProps & {
    title?: string;
    subtitle?: string;
    background?: UIColor;
    padding?: UISpacing;
    radius?: UIRadius;
    shadow?: UIShadow;
  };

  chart: UIBaseProps & {
    data: Array<{
      label: string;
      value: number;
      color?: string;
    }>;
    chartType?: "bar" | "line";
    title?: string;
    height?: number;
    showValues?: boolean;
    showGrid?: boolean;
    showTooltips?: boolean;
  };

  list: UIBaseProps & {
    padding?: UISpacing;
    gap?: UISpacing;
    width?: UIWidth;
  };

  listItem: UIBaseProps & {
    onClickAction?: Event;
    gap?: UISpacing;
    padding?: UISpacing;
    background?: UIColor;
    radius?: UIRadius;
    align?: UIAlign;
    truncate?: boolean;
  };

  streamingText: UIBaseProps & {
    eventType: string;
    size?: UISize;
    weight?: UIFontWeight;
    color?: UIColor;
    align?: UITextAlign;
    markdown?: boolean;
  };

  thread: UIBaseProps & {
    placeholder?: string;
    messages?: Array<{
      role: string;
      content: any[];
      runId?: string;
      threadId?: string;
    }>;
    autoFocus?: boolean;
    children?: any;
  };
}

// ─── Node & Event Types ─────────────────────────────────────────────────────────

export type UINode<T extends keyof UIContract = keyof UIContract> = {
  type: T;
  props?: UIContract[T];
  children?: UINode<any>[];
};

export interface UIEvent extends Event<UINode> {
  type: "ui";
}
