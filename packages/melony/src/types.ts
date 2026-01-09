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
    groupId?: string;
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
    onSubmitAction?: Event | ((data: any) => Event);
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
    type?: string;
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
  image: (
    src: string,
    alt?: string,
    size: UISize = "md",
    groupId?: string
  ): UINode<"image"> => ({
    type: "image",
    props: { src, alt, size, groupId },
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
    invalidateQuery: (queryKey: any[]): Event => ({
      type: "client:invalidate-query",
      data: { queryKey },
    }),
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
  threadTitle?: string;
  timestamp?: number;
  role?: Role;
  state?: any;
  /**
   * Optional next action to execute immediately.
   * If provided, the runtime will skip the initial brain dispatch.
   */
  nextAction?: NextAction;
};

export interface Message {
  role: Role;
  content: Event[];
  runId?: string;
  threadId?: string;
}

// ============================================
// Runtime & Hooks
// ============================================

export type ActionExecute<
  TParams extends z.ZodSchema = z.ZodSchema,
  TState = any,
> = (
  params: z.infer<TParams>,
  context: RuntimeContext<TState>
) => AsyncGenerator<Event, NextAction | void, unknown>;

export interface Action<
  TParams extends z.ZodSchema = z.ZodObject<any>,
  TState = any,
> {
  name: string;
  description?: string;
  paramsSchema: TParams;
  execute: ActionExecute<TParams, TState>;
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
  actions: Record<string, Action<any, TState>>;
  ui: typeof ui;

  /**
   * Immediately interrupts the runtime execution.
   * If an event is provided, it will be emitted before the runtime stops.
   */
  suspend: (event?: Event) => never;
}

/**
 * Standardized Hook Result.
 * Now a generator to allow yielding multiple events and returning a result.
 */
export type HookGenerator<TReturn = void> = AsyncGenerator<
  Event,
  TReturn | void,
  unknown
>;

export interface Hooks<TState = any> {
  /**
   * Called when a run session begins.
   * Can yield Events to be emitted, and return a NextAction to jump-start the loop.
   */
  onBeforeRun?: (
    input: { event: Event },
    context: RuntimeContext<TState>
  ) => HookGenerator<NextAction>;

  /**
   * Called when a run session completes.
   */
  onAfterRun?: (context: RuntimeContext<TState>) => HookGenerator;

  /**
   * Called whenever an event is yielded by the runtime.
   */
  onEvent?: (event: Event, context: RuntimeContext<TState>) => HookGenerator;

  /**
   * Called before an action is executed.
   * Yield events to intercept, and return a NextAction to redirect/suspend.
   */
  onBeforeAction?: (
    call: { action: Action<any, TState>; params: any; nextAction: NextAction },
    context: RuntimeContext<TState>
  ) => HookGenerator<NextAction>;

  /**
   * Called after an action completes.
   */
  onAfterAction?: (
    result: { action: Action<any, TState>; data: NextAction | void },
    context: RuntimeContext<TState>
  ) => HookGenerator<NextAction>;
}

/**
 * A plugin is just a named set of hooks.
 */
export interface Plugin<TState = any> extends Hooks<TState> {
  name: string;
}

export type Brain<TState = any> = (
  event: Event,
  context: RuntimeContext<TState>
) => AsyncGenerator<Event, NextAction | void, unknown>;

export interface Config<TState = any> {
  actions: Record<string, Action<any, TState>>;
  /**
   * The central brain for handling incoming events.
   */
  brain?: Brain<TState>;
  hooks?: Hooks<TState>;
  plugins?: Plugin<TState>[];
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
