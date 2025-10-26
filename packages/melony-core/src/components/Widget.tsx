import { useWidgets } from "../widgets-context";
import { WidgetTemplate } from "../widget-template";
import { useMemo } from "react";
import { MelonyParser } from "../parser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { renderComponent } from "../renderer";
import { TemplateEngine } from "../template-engine";
import { useContextValue } from "../context-provider";

const parser = new MelonyParser();

export interface WidgetProps {
  type: string;
  [key: string]: any;
}

export const Widget: React.FC<WidgetProps> = ({ type, ...props }) => {
  const widgets = useWidgets();
  const context = useContextValue();
  const widget = widgets.find((widget: WidgetTemplate) => widget.type === type);

  // Process template with props and parse the content to extract component tags
  const blocks = useMemo(() => {
    if (!widget?.template) return [];

    // Use custom template engine to render template with props
    const processedTemplate = TemplateEngine.render(widget.template, {
      ...props,
      ...context,
    });

    return parser.parseContentAsBlocks(processedTemplate);
  }, [widget?.template, props, parser]);

  if (!widget) {
    return <>No widget found</>;
  }

  return (
    <>
      {blocks.map((block, index) => {
        if (typeof block === "string") {
          return (
            <ReactMarkdown key={`text-${index}`} remarkPlugins={[remarkGfm]}>
              {block}
            </ReactMarkdown>
          );
        }
        return renderComponent(block, `component-${index}`);
      })}
    </>
  );
};
