import z from "zod";
import { ui } from "./ui";

// ============================================
// UI Protocol & Contracts
// ============================================

export type UISize = "sm" | "md" | "lg";
export type UIAlign = "start" | "center" | "end" | "stretch";
export type UIJustify = "start" | "center" | "end" | "between" | "around";
export type UIWrap = "nowrap" | "wrap" | "wrap-reverse";
export type UIOrientation = "horizontal" | "vertical";

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
  | "transparent";

export type UISpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type UIWidth =
  | "auto"
  | "full"
  | "min"
  | "max"
  | "1/2"
  | "1/3"
  | "2/3"
  | "1/4"
  | "3/4";
export type UIShadow = "none" | "sm" | "md" | "lg" | "xl";
export type UIRadius = "none" | "sm" | "md" | "lg" | "full";

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
    isLoading?: boolean;
    group?: boolean;
  };
  row: {
    align?: UIAlign;
    justify?: UIJustify;
    wrap?: UIWrap;
    gap?: UISpacing;
    padding?: UISpacing;
    width?: UIWidth;
    group?: boolean;
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
  };
  box: {
    padding?: UISpacing;
    margin?: UISpacing;
    background?: UIColor;
    border?: boolean;
    borderColor?: UIColor;
    radius?: UIRadius;
    width?: UIWidth;
    height?: "auto" | "full";
    shadow?: UIShadow;
    group?: boolean;
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
}

export type UINode<T extends keyof UIContract = keyof UIContract> = {
  type: T;
  props?: UIContract[T];
  children?: UINode<any>[];
};

// ============================================
// Events (Generic & Headless)
// ============================================

export type Role = "user" | "assistant" | "system";

/**
 * System-managed metadata for an event.
 */
export interface EventMeta<TState = any> {
  id: string;
  runId: string;
  timestamp: number;
  role: Role;
  state: TState;
  surface?: string;
  slot?: string;
  threadId?: string;
  threadTitle?: string;
  [key: string]: any;
}

/**
 * The core Event structure.
 * TEvent can be a union of your application's business events.
 */
export type Event<TData = any> = {
  type: string;
  data: TData;
  meta?: EventMeta;
  nextAction?: NextAction;
};

export interface Message<TEvent extends Event = Event> {
  role: Role;
  content: TEvent[];
  runId?: string;
  threadId?: string;
}

// ============================================
// Runtime & Hooks
// ============================================

export type ActionExecute<
  TParams extends z.ZodSchema = z.ZodSchema,
  TState = any,
  TEvent extends Event = Event,
> = (
  params: z.infer<TParams>,
  context: RuntimeContext<TState, TEvent>,
) => AsyncGenerator<TEvent, NextAction | void, unknown>;

export interface Action<
  TParams extends z.ZodSchema = z.ZodObject<any>,
  TState = any,
  TEvent extends Event = Event,
> {
  name: string;
  description?: string;
  paramsSchema: TParams;
  execute: ActionExecute<TParams, TState, TEvent>;
}

export interface NextAction {
  action?: string;
  params?: any;
  description?: string;
  [key: string]: any; // Allow metadata like toolCallId
}

export interface RuntimeContext<TState = any, TEvent extends Event = Event> {
  state: TState;
  runId: string;
  stepCount: number;
  actions: Record<string, Action<any, TState, TEvent>>;
  ui: typeof ui;

  /**
   * Immediately interrupts the runtime execution.
   * If an event is provided, it will be emitted before the runtime stops.
   */
  suspend: (event?: TEvent) => never;
}

/**
 * Standardized Hook Result.
 */
export type HookGenerator<TEvent extends Event = Event, TReturn = void> = AsyncGenerator<
  TEvent,
  TReturn | void,
  unknown
>;

export interface Hooks<TState = any, TEvent extends Event = Event> {
  /**
   * Called when a run session begins.
   */
  onBeforeRun?: (
    input: { event: TEvent },
    context: RuntimeContext<TState, TEvent>,
  ) => HookGenerator<TEvent, NextAction>;

  /**
   * Called when a run session completes.
   */
  onAfterRun?: (context: RuntimeContext<TState, TEvent>) => HookGenerator<TEvent>;

  /**
   * Called whenever an event is yielded by the runtime.
   */
  onEvent?: (event: TEvent, context: RuntimeContext<TState, TEvent>) => HookGenerator<TEvent>;

  /**
   * Called before an action is executed.
   */
  onBeforeAction?: (
    call: { action: Action<any, TState, TEvent>; params: any; nextAction: NextAction },
    context: RuntimeContext<TState, TEvent>,
  ) => HookGenerator<TEvent, NextAction>;

  /**
   * Called after an action completes.
   */
  onAfterAction?: (
    result: { action: Action<any, TState, TEvent>; data: NextAction | void },
    context: RuntimeContext<TState, TEvent>,
  ) => HookGenerator<TEvent, NextAction>;
}

/**
 * A plugin is just a named set of hooks.
 */
export interface Plugin<TState = any, TEvent extends Event = Event> extends Hooks<TState, TEvent> {
  name: string;
}

export interface Config<TState = any, TEvent extends Event = Event> {
  actions: Record<string, Action<any, TState, TEvent>>;
  hooks?: Hooks<TState, TEvent>;
  plugins?: Plugin<TState, TEvent>[];
  safetyMaxSteps?: number;
  starterPrompts?: Array<{
    label: string;
    prompt: string;
    icon?: string;
  }>;
  options?: Array<{
    id: string;
    label: string;
    options: Array<{ id: string; label: string; value: any }>;
    type?: "single" | "multiple";
    defaultSelectedIds?: string[];
  }>;
  fileAttachments?: {
    enabled?: boolean;
    accept?: string;
    maxFiles?: number;
    maxFileSize?: number;
  };
}
