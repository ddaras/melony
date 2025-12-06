import { useMemo } from "react";
import { WidgetDefinition, parseContent, renderTemplate } from "@melony/client";
import { Renderer } from "./renderer";
import { createDefaultComponents } from "./default-components";

export function Widget({
  widget,
  data,
  components,
}: {
  widget: WidgetDefinition;
  data: any;
  components?: Record<string, React.FC<any>>;
}) {
  const defaultComponents = useMemo(() => createDefaultComponents(), []);

  const componentMap = useMemo(
    () => ({ ...defaultComponents, ...components }),
    [components]
  );

  const renderedContent = useMemo(() => {
    // If there is no data, skip templating to avoid accidental mustache syntax issues
    if (Object.keys(data).length === 0) return widget.template;
    return renderTemplate(widget.template, data);
  }, [widget.template, data]);

  const blocks = useMemo(
    () => parseContent(renderedContent),
    [renderedContent]
  );

  return <Renderer blocks={blocks} components={componentMap} />;
}
