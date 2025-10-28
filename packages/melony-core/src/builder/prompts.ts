import { WidgetTemplate } from "../widget-template";

export const createWidgetPrompt = (
  widget: WidgetTemplate,
  description: string
): string => {
  return `\n - ${widget.type}: <widget type="${widget.type}" ${widget.props?.map((prop) => `${prop.name}="${prop.default || "[VALUE]"}"`).join(" ")} />\n\n
    ${description}\n\n
    Prop Descriptions: ${widget.props?.map((prop) => `${prop.name}: ${prop.description || "No description"}`).join("\n")}
    `;
};
