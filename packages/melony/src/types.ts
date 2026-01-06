import z from "zod";

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
  | "border";

export type UISpacing = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/**
 * UI Component Contracts
 * This acts as the source of truth for the SDUI protocol.
 */
export interface UIContract {
  card: {
    title?: string;
    subtitle?: string;
    background?: string;
    isLoading?: boolean;
  };
  row: {
    align?: UIAlign;
    justify?: UIJustify;
    wrap?: UIWrap;
    gap?: UISpacing;
  };
  col: {
    align?: UIAlign;
    justify?: UIJustify;
    gap?: UISpacing;
    width?: string | number;
    height?: string | number;
    padding?: UISpacing;
  };
  box: {
    padding?: UISpacing;
    margin?: string | number;
    background?: string;
    border?: boolean;
    borderRadius?: UISpacing;
    width?: string | number;
    height?: string | number;
  };
  spacer: {
    size?: UISpacing;
    direction?: UIOrientation;
  };
  divider: {
    orientation?: UIOrientation;
    color?: UIColor;
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
  };
  badge: {
    label: string;
    variant?: "primary" | "secondary" | "success" | "danger" | "warning";
    size?: UISize;
  };
  image: {
    src: string;
    alt?: string;
    size?: UISize;
  };
  icon: {
    name: string;
    size?: UISize;
    color?: UIColor;
  };
  chart: {
    data: Array<{ label: string; value: number; color?: string }>;
    chartType?: "bar" | "line" | "area" | "pie";
    title?: string;
  };
  list: {};
  listItem: {
    onClickAction?: Event;
    gap?: UISpacing;
  };
  form: {
    onSubmitAction?: Event;
  };
  input: {
    name: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    inputType?: string;
    onChangeAction?: Event;
  };
  textarea: {
    name: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    rows?: number;
    onChangeAction?: Event;
  };
  select: {
    name: string;
    label?: string;
    options: Array<{ label: string; value: string }>;
    defaultValue?: string;
    placeholder?: string;
    onChangeAction?: Event;
  };
  checkbox: {
    name: string;
    label?: string;
    checked?: boolean;
    onChangeAction?: Event;
  };
  radioGroup: {
    name: string;
    options: Array<{ label: string; value: string; disabled?: boolean }>;
    label?: string;
    defaultValue?: string;
    orientation?: UIOrientation;
    onChangeAction?: Event;
  };
  label: {
    value: string;
    htmlFor?: string;
    required?: boolean;
  };
  button: {
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
    onClickAction?: Event;
  };
}

export type UINode<T extends keyof UIContract = keyof UIContract> = {
  type: T;
  props?: UIContract[T];
  children?: UINode<any>[];
};

/**
 * UI Builder for SDUI.
 * Typed using the UIContract source of truth.
 */
export const ui = {
  card: (
    props: UIContract["card"] & { children?: UINode<any>[] }
  ): UINode<"card"> => {
    const { children, ...rest } = props;
    return { type: "card", props: rest, children };
  },
  row: (
    props: UIContract["row"] & { children?: UINode<any>[] }
  ): UINode<"row"> => {
    const { children, ...rest } = props;
    return { type: "row", props: rest, children };
  },
  col: (
    props: UIContract["col"] & { children?: UINode<any>[] }
  ): UINode<"col"> => {
    const { children, ...rest } = props;
    return { type: "col", props: rest, children };
  },
  box: (
    props: UIContract["box"] & { children?: UINode<any>[] }
  ): UINode<"box"> => {
    const { children, ...rest } = props;
    return { type: "box", props: rest, children };
  },
  spacer: (props: UIContract["spacer"]): UINode<"spacer"> => ({
    type: "spacer",
    props,
  }),
  divider: (props: UIContract["divider"]): UINode<"divider"> => ({
    type: "divider",
    props,
  }),
  text: (
    value: string,
    props?: Omit<UIContract["text"], "value">
  ): UINode<"text"> => ({
    type: "text",
    props: { ...props, value },
  }),
  heading: (
    value: string,
    level: UIContract["heading"]["level"] = 1
  ): UINode<"heading"> => ({
    type: "heading",
    props: { value, level },
  }),
  badge: (
    label: string,
    variant: UIContract["badge"]["variant"] = "primary",
    size: UISize = "md"
  ): UINode<"badge"> => ({
    type: "badge",
    props: { label, variant, size },
  }),
  image: (src: string, alt?: string, size: UISize = "md"): UINode<"image"> => ({
    type: "image",
    props: { src, alt, size },
  }),
  icon: (
    name: string,
    size: UISize = "md",
    color?: UIColor
  ): UINode<"icon"> => ({
    type: "icon",
    props: { name, size, color },
  }),
  chart: (props: UIContract["chart"]): UINode<"chart"> => ({
    type: "chart",
    props,
  }),
  list: (children: UINode<any>[]): UINode<"list"> => ({
    type: "list",
    children,
  }),
  listItem: (
    props: UIContract["listItem"] & { children: UINode<any>[] }
  ): UINode<"listItem"> => {
    const { children, ...rest } = props;
    return { type: "listItem", props: rest, children };
  },
  form: (
    props: UIContract["form"] & { children?: UINode<any>[] }
  ): UINode<"form"> => {
    const { children, ...rest } = props;
    return { type: "form", props: rest, children };
  },
  input: (props: UIContract["input"]): UINode<"input"> => ({
    type: "input",
    props,
  }),
  textarea: (props: UIContract["textarea"]): UINode<"textarea"> => ({
    type: "textarea",
    props,
  }),
  select: (props: UIContract["select"]): UINode<"select"> => ({
    type: "select",
    props,
  }),
  checkbox: (props: UIContract["checkbox"]): UINode<"checkbox"> => ({
    type: "checkbox",
    props,
  }),
  radioGroup: (props: UIContract["radioGroup"]): UINode<"radioGroup"> => ({
    type: "radioGroup",
    props,
  }),
  label: (
    value: string,
    props?: Omit<UIContract["label"], "value">
  ): UINode<"label"> => ({
    type: "label",
    props: { ...props, value },
  }),
  button: (props: UIContract["button"]): UINode<"button"> => ({
    type: "button",
    props,
  }),
  actions: {
    navigate: (url: string): Event => ({
      type: "client:navigate",
      data: { url },
    }),
    openUrl: (url: string, target = "_blank"): Event => ({
      type: "client:open-url",
      data: { url, target },
    }),
    copy: (text: string): Event => ({ type: "client:copy", data: { text } }),
    reset: (): Event => ({ type: "client:reset" }),
  },
};

// ============================================
// Events
// ============================================

export type Role = "user" | "assistant" | "system";

export type Event = {
  type: string;
  data?: any;
  ui?: UINode;
  slot?: string;
  runId?: string;
  threadId?: string;
  timestamp?: number;
  role?: Role;
  state?: any;
};

// ============================================
// Runtime & Hooks
// ============================================

export interface Action<TParams extends z.ZodSchema = z.ZodObject<any>> {
  name: string;
  description?: string;
  paramsSchema: TParams;
  execute: (
    params: z.infer<TParams>,
    context: RuntimeContext
  ) => AsyncGenerator<Event, NextAction | void, unknown>;
}

export interface NextAction {
  action?: string;
  params?: any;
  description?: string;
  [key: string]: any; // Allow metadata like toolCallId
}

export interface RuntimeContext<TState = any> {
  state: TState;
  runId: string;
  stepCount: number;
  actions: Record<string, Action<any>>;
  ui: typeof ui;
  /**
   * Immediately interrupts the runtime execution.
   * If an event is provided, it will be emitted before the runtime stops.
   */
  suspend: (event?: Event) => never;
}

/**
 * Standardized Hook Result for consistent DX.
 */
export type HookResult = Promise<Event | void>;

export interface Hooks {
  /**
   * Called when a run session begins.
   * Can return an Event to be emitted, or a NextAction to jump-start the loop.
   */
  onBeforeRun?: (
    input: { event: Event; runId: string; state: Record<string, any> },
    context: RuntimeContext
  ) => HookResult;

  /**
   * Called when a run session completes.
   */
  onAfterRun?: (context: RuntimeContext) => HookResult;

  /**
   * Called whenever an event is yielded by the runtime.
   */
  onEvent?: (event: Event, context: RuntimeContext) => HookResult;

  /**
   * Called before an action is executed.
   * Return an event to intercept/suspend the action.
   */
  onBeforeAction?: (
    call: { action: Action<any>; params: any; nextAction: NextAction },
    context: RuntimeContext
  ) => HookResult;

  /**
   * Called after an action completes.
   */
  onAfterAction?: (
    result: { action: Action<any>; data: NextAction | void },
    context: RuntimeContext
  ) => HookResult;
}

/**
 * A plugin is just a named set of hooks.
 */
export interface Plugin extends Hooks {
  name: string;
}

export interface Config {
  actions: Record<string, Action<any>>;
  /**
   * The central brain for handling incoming events.
   */
  brain?: (
    event: Event,
    context: RuntimeContext
  ) => AsyncGenerator<Event, NextAction | void, unknown>;
  hooks?: Hooks;
  plugins?: Plugin[];
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
    accept?: string; // e.g., "image/*,.pdf" for file input accept attribute
    maxFiles?: number; // Maximum number of files allowed
    maxFileSize?: number; // Maximum file size in bytes
  };
}
