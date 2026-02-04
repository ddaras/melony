import { UIContract, UINode, UIEvent } from "./types";

export * from "./types";

/**
 * Helper to create UI events in Melony actions.
 */
export const ui = {
  /**
   * Creates a UI node.
   */
  node: <T extends keyof UIContract>(
    type: T,
    props: UIContract[T] = {} as any,
    children: UINode<any>[] = []
  ): UINode<T> => ({
    type,
    props,
    children,
  }),

  /**
   * Wraps a UI node in an event.
   */
  event: (node: UINode): UIEvent => ({
    type: "ui",
    data: node,
  }),

  card: (props: UIContract["card"] = {}, children: UINode[] = []) =>
    ui.node("card", props, children),

  button: (props: UIContract["button"], children: UINode[] = []) =>
    ui.node("button", props, children),

  text: (value: string, props: Partial<UIContract["text"]> = {}) =>
    ui.node("text", { value, ...props }),

  heading: (value: string, level: UIContract["heading"]["level"] = 1, props: Partial<UIContract["heading"]> = {}) =>
    ui.node("heading", { value, level, ...props }),

  row: (props: UIContract["row"] = {}, children: UINode[] = []) =>
    ui.node("row", props, children),

  col: (props: UIContract["col"] = {}, children: UINode[] = []) =>
    ui.node("col", props, children),

  box: (props: UIContract["box"] = {}, children: UINode[] = []) =>
    ui.node("box", props, children),

  badge: (label: string, variant: UIContract["badge"]["variant"] = "primary", props: Partial<UIContract["badge"]> = {}) =>
    ui.node("badge", { label, variant, ...props }),

  input: (name: string, label?: string, props: Partial<UIContract["input"]> = {}) =>
    ui.node("input", { name, label, ...props }),

  textarea: (name: string, label?: string, props: Partial<UIContract["textarea"]> = {}) =>
    ui.node("textarea", { name, label, ...props }),

  select: (name: string, options: UIContract["select"]["options"], label?: string, props: Partial<UIContract["select"]> = {}) =>
    ui.node("select", { name, options, label, ...props }),

  checkbox: (name: string, label?: string, props: Partial<UIContract["checkbox"]> = {}) =>
    ui.node("checkbox", { name, label, ...props }),

  form: (props: UIContract["form"] = {}, children: UINode[] = []) =>
    ui.node("form", props, children),

  icon: (name: string, props: Partial<UIContract["icon"]> = {}) =>
    ui.node("icon", { name, ...props }),

  image: (src: string, alt?: string, props: Partial<UIContract["image"]> = {}) =>
    ui.node("image", { src, alt, ...props }),

  spacer: (props: UIContract["spacer"] = {}) =>
    ui.node("spacer", props),

  divider: (props: UIContract["divider"] = {}) =>
    ui.node("divider", props),

  list: (props: UIContract["list"] = {}, children: UINode[] = []) =>
    ui.node("list", props, children),

  listItem: (props: UIContract["listItem"] = {}, children: UINode[] = []) =>
    ui.node("listItem", props, children),

  // organisms
  thread: (props: UIContract["thread"] = {}, children: UINode[] = []) =>
    ui.node("thread", props, children),
};
