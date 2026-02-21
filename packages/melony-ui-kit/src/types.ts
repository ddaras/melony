import type { Event } from "melony";

export type UISize = "sm" | "md" | "lg" | (string & {});
export type UIAlign = "start" | "center" | "end" | "stretch" | (string & {});
export type UIJustify = "start" | "center" | "end" | "between" | "around" | (string & {});
export type UIWrap = "nowrap" | "wrap" | "wrap-reverse" | (string & {});
export type UIOrientation = "horizontal" | "vertical" | (string & {});

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

export type UISpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | (string & {});

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
export type UIShadow = "none" | "sm" | "md" | "lg" | "xl" | (string & {});
export type UIRadius = "none" | "sm" | "md" | "lg" | "full" | (string & {});

/**
 * UI Component Contracts
 * This acts as the source of truth for the SDUI protocol.
 */
export interface UIContract {
  row: {
    id?: string;
    align?: UIAlign;
    justify?: UIJustify;
    wrap?: UIWrap;
    gap?: UISpacing;
    padding?: UISpacing;
    width?: UIWidth;
    height?: "auto" | "full";
    group?: boolean;
    flex?: number;
    overflow?: "hidden" | "visible" | "scroll" | "auto";
  };
  col: {
    id?: string;
    align?: UIAlign;
    justify?: UIJustify;
    gap?: UISpacing;
    width?: UIWidth;
    height?: "auto" | "full";
    padding?: UISpacing;
    background?: UIColor;
    radius?: UIRadius;
    group?: boolean;
    flex?: number;
    overflow?: "hidden" | "visible" | "scroll" | "auto";
    maxWidth?: number | string;
  };
  box: {
    id?: string;
    padding?: UISpacing;
    paddingVertical?: UISpacing;
    paddingHorizontal?: UISpacing;
    margin?: UISpacing;
    marginVertical?: UISpacing;
    marginHorizontal?: UISpacing;
    background?: UIColor;
    border?: boolean;
    borderColor?: UIColor;
    radius?: UIRadius;
    width?: UIWidth;
    maxWidth?: number | string;
    height?: "auto" | "full";
    shadow?: UIShadow;
    group?: boolean;
    flex?: number;
    overflow?: "hidden" | "visible" | "scroll" | "auto";
    onClickAction?: Event;
  };
  spacer: {
    id?: string;
    size?: UISpacing;
    direction?: UIOrientation;
  };
  divider: {
    id?: string;
    orientation?: UIOrientation;
    color?: UIColor;
    margin?: UISpacing;
  };
  text: {
    id?: string;
    value: string;
    size?: UISpacing;
    weight?: "normal" | "medium" | "semibold" | "bold";
    color?: UIColor;
    align?: UIAlign;
    className?: string;
  };
  heading: {
    id?: string;
    value: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    color?: UIColor;
    align?: UIAlign;
  };
  markdown: {
    id?: string;
    value: string;
    size?: UISpacing;
    color?: UIColor;
    align?: UIAlign;
    className?: string;
  };
  image: {
    id?: string;
    src: string;
    alt?: string;
    width?: UIWidth;
    height?: string | number;
    radius?: UIRadius;
    objectFit?: "cover" | "contain" | "fill";
  };
  video: {
    id?: string;
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
  icon: {
    id?: string;
    name: string;
    size?: UISize | number;
    color?: UIColor;
  };
  form: {
    id?: string;
    onSubmitAction?: Event | ((data: any) => Event);
    gap?: UISpacing;
  };
  input: {
    id?: string;
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
  textarea: {
    id?: string;
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
    background?: UIColor;
    border?: boolean;
    shadow?: UIShadow;
    radius?: UIRadius;
  };
  select: {
    id?: string;
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
  checkbox: {
    id?: string;
    name: string;
    label?: string;
    checked?: boolean;
    onChangeAction?: Event;
    disabled?: boolean;
  };
  hidden: {
    id?: string;
    name: string;
    value: string;
  };
  radioGroup: {
    id?: string;
    name: string;
    options: Array<{ label: string; value: string; disabled?: boolean }>;
    label?: string;
    defaultValue?: string;
    orientation?: UIOrientation;
    onChangeAction?: Event;
    disabled?: boolean;
  };
  label: {
    id?: string;
    value: string;
    htmlFor?: string;
    required?: boolean;
    size?: UISpacing;
    color?: UIColor;
  };
  colorPicker: {
    id?: string;
    name: string;
    label?: string;
    defaultValue?: string;
    onChangeAction?: Event;
    disabled?: boolean;
  };
  upload: {
    id?: string;
    label?: string;
    multiple?: boolean;
    accept?: string;
    initialFiles?: { name: string; url: string }[];
    onUploadAction?: Event | ((data: any) => Event);
    mode?: "append" | "replace";
    disabled?: boolean;
  };
  button: {
    id?: string;
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
  popover: {
    id?: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
    modal?: boolean;
    trigger?: UINode;
  };
  float: {
    id?: string;
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
  sticky: {
    id?: string;
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
  streamingText: {
    id?: string;
    eventType: string;
    size?: UISpacing;
    weight?: "normal" | "medium" | "semibold" | "bold";
    color?: UIColor;
    align?: UIAlign;
    className?: string;
    markdown?: boolean;
  };
  badge: {
    id?: string;
    label: string;
    variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "outline";
    size?: UISize;
  };
  card: {
    id?: string;
    title?: string;
    subtitle?: string;
    background?: UIColor;
    padding?: UISpacing;
    radius?: UIRadius;
    shadow?: UIShadow;
  };
  chart: {
    id?: string;
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
  dropdown: {
    id?: string;
    items?: Array<{
      label: string;
      icon?: string;
      onClickAction?: Event;
    }>;
  };
  list: {
    id?: string;
    padding?: UISpacing;
    gap?: UISpacing;
    width?: UIWidth;
  };
  listItem: {
    id?: string;
    onClickAction?: Event;
    gap?: UISpacing;
    padding?: UISpacing;
    background?: UIColor;
    radius?: UIRadius;
    align?: UIAlign;
    truncate?: boolean;
  };
  thread: {
    id?: string;
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

export type UINode<T extends keyof UIContract = keyof UIContract> = {
  type: T;
  props?: UIContract[T];
  children?: UINode<any>[];
};

/**
 * Standard UI event type for Melony.
 */
export interface UIEvent extends Event<UINode> {
  type: "ui";
}
