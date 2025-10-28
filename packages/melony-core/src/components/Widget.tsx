import { useWidgets } from "../widgets-context";
import { WidgetTemplate } from "../widget-template";
import { useMemo } from "react";
import { MelonyParser } from "../parser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { renderComponent } from "../renderer";
import { TemplateEngine } from "../template-engine";
import { ContextProvider, useContextValue } from "../context-provider";

export interface WidgetProps {
  type: string;
  [key: string]: any;
}

export const Widget: React.FC<WidgetProps> = ({ type, ...props }) => {
  const widgets = useWidgets();
  const context = useContextValue();
  const widget = widgets.find((widget: WidgetTemplate) => widget.type === type);

  console.log("props", props);

  // Create parser with widget schemas
  const parser = useMemo(() => new MelonyParser(widgets), [widgets]);

  // Process template with props and parse the content to extract component tags
  const templateBlocks = useMemo(() => {
    if (!widget?.template) return [];

    // Use custom template engine to render template with props
    const processedTemplate = TemplateEngine.render(widget.template, {
      ...props,
      ...context,
    });

    console.log("processedTemplate", processedTemplate);

    return parser.parseContentAsBlocks(processedTemplate);
  }, [widget?.template, props, context, parser]);

  if (!widget) {
    return <>No widget found</>;
  }

  console.log("templateBlocks", templateBlocks);

  return (
    <ContextProvider context={{ ...context, ...props }}>
      {templateBlocks.map((block, index) => {
        if (typeof block === "string") {
          return (
            <ReactMarkdown key={`text-${index}`} remarkPlugins={[remarkGfm]}>
              {block}
            </ReactMarkdown>
          );
        }
        return renderComponent(block, `component-${index}`);
      })}
    </ContextProvider>
  );
};
