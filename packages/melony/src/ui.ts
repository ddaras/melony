import {
  UIColor,
  UIContract,
  UINode,
  UISize,
  Event,
  UISpacing,
  UIWidth,
  UIRadius,
} from "./types";

/**
 * UI Builder for SDUI.
 * Typed using the UIContract source of truth.
 */
export const ui = {
  card: (
    props: UIContract["card"] & { children?: UINode<any>[] },
  ): UINode<"card"> => {
    const { children, ...rest } = props;
    return { type: "card", props: rest, children };
  },
  row: (
    props: UIContract["row"] & { children?: UINode<any>[] },
  ): UINode<"row"> => {
    const { children, ...rest } = props;
    return { type: "row", props: rest, children };
  },
  col: (
    props: UIContract["col"] & { children?: UINode<any>[] },
  ): UINode<"col"> => {
    const { children, ...rest } = props;
    return { type: "col", props: rest, children };
  },
  box: (
    props: UIContract["box"] & { children?: UINode<any>[] },
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
    props?: Omit<UIContract["text"], "value">,
  ): UINode<"text"> => ({
    type: "text",
    props: { ...props, value },
  }),
  heading: (
    value: string,
    level: UIContract["heading"]["level"] = 1,
    props?: Omit<UIContract["heading"], "value" | "level">,
  ): UINode<"heading"> => ({
    type: "heading",
    props: { ...props, value, level },
  }),
  badge: (
    label: string,
    variant: UIContract["badge"]["variant"] = "primary",
    size: UISize = "md",
  ): UINode<"badge"> => ({
    type: "badge",
    props: { label, variant, size },
  }),
  image: (
    src: string,
    props?: Omit<UIContract["image"], "src">,
  ): UINode<"image"> => ({
    type: "image",
    props: { ...props, src },
  }),
  video: (
    src: string,
    props?: Omit<UIContract["video"], "src">,
  ): UINode<"video"> => ({
    type: "video",
    props: { ...props, src },
  }),
  icon: (
    name: string,
    size: UISize | number = "md",
    color?: UIColor,
  ): UINode<"icon"> => ({
    type: "icon",
    props: { name, size, color },
  }),
  chart: (props: UIContract["chart"]): UINode<"chart"> => ({
    type: "chart",
    props,
  }),
  list: (
    props: UIContract["list"] & { children: UINode<any>[] },
  ): UINode<"list"> => {
    const { children, ...rest } = props;
    return { type: "list", props: rest, children };
  },
  listItem: (
    props: UIContract["listItem"] & { children: UINode<any>[] },
  ): UINode<"listItem"> => {
    const { children, ...rest } = props;
    return { type: "listItem", props: rest, children };
  },
  form: (
    props: UIContract["form"] & { children?: UINode<any>[] },
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
  hidden: (props: UIContract["hidden"]): UINode<"hidden"> => ({
    type: "hidden",
    props,
  }),
  radioGroup: (props: UIContract["radioGroup"]): UINode<"radioGroup"> => ({
    type: "radioGroup",
    props,
  }),
  label: (
    value: string,
    props?: Omit<UIContract["label"], "value">,
  ): UINode<"label"> => ({
    type: "label",
    props: { ...props, value },
  }),
  colorPicker: (props: UIContract["colorPicker"]): UINode<"colorPicker"> => ({
    type: "colorPicker",
    props,
  }),
  upload: (props: UIContract["upload"]): UINode<"upload"> => ({
    type: "upload",
    props,
  }),
  button: (props: UIContract["button"]): UINode<"button"> => ({
    type: "button",
    props,
  }),
  float: (
    props: UIContract["float"] & { children?: UINode<any>[] },
  ): UINode<"float"> => {
    const { children, ...rest } = props;
    return { type: "float", props: rest, children };
  },
  dropdown: (
    props: UIContract["dropdown"] & { children?: UINode<any>[] },
  ): UINode<"dropdown"> => {
    const { children, ...rest } = props;
    return { type: "dropdown", props: rest, children };
  },
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
