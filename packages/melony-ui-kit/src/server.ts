import { UIContract, UINode, UIEvent } from "./types";

export * from "./types";

type NodeProps<T extends keyof UIContract> = UIContract[T];

/**
 * Builder helpers for creating UI nodes in Melony actions.
 *
 * All container helpers follow (props, children?) signature.
 * Content helpers with a required value follow (value, props?) signature.
 */
export const ui = {
  // ── Core ────────────────────────────────────────────────────────────────────

  node: <T extends keyof UIContract>(
    type: T,
    props: NodeProps<T> = {} as any,
    children: UINode<any>[] = [],
  ): UINode<T> => ({ type, props, children }),

  event: (node: UINode): UIEvent => ({ type: "ui", data: node }),

  // ── Layout ──────────────────────────────────────────────────────────────────

  row: (props: NodeProps<"row"> = {}, children: UINode[] = []) =>
    ui.node("row", props, children),

  col: (props: NodeProps<"col"> = {}, children: UINode[] = []) =>
    ui.node("col", props, children),

  box: (props: NodeProps<"box"> = {}, children: UINode[] = []) =>
    ui.node("box", props, children),

  spacer: (props: NodeProps<"spacer"> = {}) =>
    ui.node("spacer", props),

  divider: (props: NodeProps<"divider"> = {}) =>
    ui.node("divider", props),

  // ── Content ─────────────────────────────────────────────────────────────────

  text: (value: string, props: Partial<NodeProps<"text">> = {}) =>
    ui.node("text", { value, ...props }),

  heading: (value: string, props: Partial<NodeProps<"heading">> = {}) =>
    ui.node("heading", { value, ...props }),

  markdown: (value: string, props: Partial<NodeProps<"markdown">> = {}) =>
    ui.node("markdown", { value, ...props }),

  image: (src: string, props: Partial<NodeProps<"image">> = {}) =>
    ui.node("image", { src, ...props }),

  video: (src: string, props: Partial<NodeProps<"video">> = {}) =>
    ui.node("video", { src, ...props }),

  icon: (name: string, props: Partial<NodeProps<"icon">> = {}) =>
    ui.node("icon", { name, ...props }),

  // ── Interactive ─────────────────────────────────────────────────────────────

  button: (props: NodeProps<"button"> = {}, children: UINode[] = []) =>
    ui.node("button", props, children),

  badge: (label: string, props: Partial<NodeProps<"badge">> = {}) =>
    ui.node("badge", { label, ...props }),

  dropdown: (props: NodeProps<"dropdown"> = {}, children: UINode[] = []) =>
    ui.node("dropdown", props, children),

  popover: (props: NodeProps<"popover"> = {}, children: UINode[] = []) =>
    ui.node("popover", props, children),

  // ── Forms ───────────────────────────────────────────────────────────────────

  form: (props: NodeProps<"form"> = {}, children: UINode[] = []) =>
    ui.node("form", props, children),

  input: (name: string, props: Partial<NodeProps<"input">> = {}) =>
    ui.node("input", { name, ...props }),

  textarea: (name: string, props: Partial<NodeProps<"textarea">> = {}) =>
    ui.node("textarea", { name, ...props }),

  select: (name: string, options: NodeProps<"select">["options"], props: Partial<NodeProps<"select">> = {}) =>
    ui.node("select", { name, options, ...props }),

  checkbox: (name: string, props: Partial<NodeProps<"checkbox">> = {}) =>
    ui.node("checkbox", { name, ...props }),

  radioGroup: (name: string, options: NodeProps<"radioGroup">["options"], props: Partial<NodeProps<"radioGroup">> = {}) =>
    ui.node("radioGroup", { name, options, ...props }),

  label: (value: string, props: Partial<NodeProps<"label">> = {}) =>
    ui.node("label", { value, ...props }),

  hidden: (name: string, value: string) =>
    ui.node("hidden", { name, value }),

  colorPicker: (name: string, props: Partial<NodeProps<"colorPicker">> = {}) =>
    ui.node("colorPicker", { name, ...props }),

  upload: (props: NodeProps<"upload"> = {}) =>
    ui.node("upload", props),

  // ── Positioning ─────────────────────────────────────────────────────────────

  float: (props: NodeProps<"float"> = {}, children: UINode[] = []) =>
    ui.node("float", props, children),

  sticky: (props: NodeProps<"sticky"> = {}, children: UINode[] = []) =>
    ui.node("sticky", props, children),

  // ── Compound ────────────────────────────────────────────────────────────────

  card: (props: NodeProps<"card"> = {}, children: UINode[] = []) =>
    ui.node("card", props, children),

  chart: (data: NodeProps<"chart">["data"], props: Partial<NodeProps<"chart">> = {}) =>
    ui.node("chart", { data, ...props }),

  list: (props: NodeProps<"list"> = {}, children: UINode[] = []) =>
    ui.node("list", props, children),

  listItem: (props: NodeProps<"listItem"> = {}, children: UINode[] = []) =>
    ui.node("listItem", props, children),

  streamingText: (eventType: string, props: Partial<NodeProps<"streamingText">> = {}) =>
    ui.node("streamingText", { eventType, ...props }),

  thread: (props: NodeProps<"thread"> = {}, children: UINode[] = []) =>
    ui.node("thread", props, children),
};
