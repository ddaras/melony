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
  card: {
    title?: string;
    subtitle?: string;
    background?: UIColor;
    padding?: UISpacing;
    radius?: UIRadius;
    shadow?: UIShadow;
    streaming?: boolean;
    group?: boolean;
  };
  row: {
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
  };
  box: {
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
    height?: "auto" | "full";
    shadow?: UIShadow;
    group?: boolean;
    flex?: number;
    overflow?: "hidden" | "visible" | "scroll" | "auto";
  };
  spacer: {
    size?: UISpacing;
    direction?: UIOrientation;
  };
  divider: {
    orientation?: UIOrientation;
    color?: UIColor;
    margin?: UISpacing;
  };
  text: {
    value: string;
    size?: UISpacing;
    weight?: "normal" | "medium" | "semibold" | "bold";
    color?: UIColor;
    align?: UIAlign;
  };
  heading: {
    value: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    color?: UIColor;
    align?: UIAlign;
  };
  badge: {
    label: string;
    variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "outline";
    size?: UISize;
  };
  image: {
    src: string;
    alt?: string;
    width?: UIWidth;
    height?: string | number;
    radius?: UIRadius;
    objectFit?: "cover" | "contain" | "fill";
    groupId?: string;
  };
  video: {
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
    name: string;
    size?: UISize | number;
    color?: UIColor;
  };
  chart: {
    data: Array<{ label: string; value: number; color?: string }>;
    chartType?: "bar" | "line" | "area" | "pie";
    title?: string;
    height?: number;
    showValues?: boolean;
    showGrid?: boolean;
    showTooltips?: boolean;
  };
  list: {
    padding?: UISpacing;
    gap?: UISpacing;
    width?: UIWidth;
  };
  listItem: {
    onClickAction?: Event;
    gap?: UISpacing;
    padding?: UISpacing;
    background?: UIColor;
    radius?: UIRadius;
  };
  form: {
    onSubmitAction?: Event | ((data: any) => Event);
    gap?: UISpacing;
  };
  input: {
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
    name: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    rows?: number;
    onChangeAction?: Event;
    disabled?: boolean;
    required?: boolean;
    width?: UIWidth;
  };
  select: {
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
    name: string;
    label?: string;
    checked?: boolean;
    onChangeAction?: Event;
    disabled?: boolean;
  };
  hidden: {
    name: string;
    value: string;
  };
  radioGroup: {
    name: string;
    options: Array<{ label: string; value: string; disabled?: boolean }>;
    label?: string;
    defaultValue?: string;
    orientation?: UIOrientation;
    onChangeAction?: Event;
    disabled?: boolean;
  };
  label: {
    value: string;
    htmlFor?: string;
    required?: boolean;
    size?: UISpacing;
    color?: UIColor;
  };
  colorPicker: {
    name: string;
    label?: string;
    defaultValue?: string;
    onChangeAction?: Event;
    disabled?: boolean;
  };
  upload: {
    label?: string;
    multiple?: boolean;
    accept?: string;
    initialFiles?: { name: string; url: string }[];
    onUploadAction?: Event | ((data: any) => Event);
    mode?: "append" | "replace";
    disabled?: boolean;
  };
  button: {
    type?: "button" | "submit" | "reset";
    label: string;
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
  };
  float: {
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
  dropdown: {
    items: Array<{
      label: string;
      icon?: string;
      onClickAction?: Event;
    }>;
    className?: string;
    triggerClassName?: string;
  };
  thread: {
    placeholder?: string;
    messages?: any[];
    autoFocus?: boolean;
    welcomeTitle?: string;
    welcomeMessage?: string;
    suggestions?: string[];
  };
  themeToggle: {
    theme?: "light" | "dark" | "system";
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
