import React, { useMemo } from "react";
import { parseContent, renderTemplate } from "@melony/client";
import { useMelony } from "./melony-context";
import { Renderer } from "./renderer";
import { createDefaultComponents } from "./default-components";

const defaultComponents = createDefaultComponents();

export interface ResponseProps {
  content: string;
  data?: Record<string, any>;
  components?: Record<string, React.FC<any>>;
}

export function Response({
  content,
  data = {},
  components = {},
}: ResponseProps) {
  const { widgetRegistry } = useMelony();

  // Merge all component sources: defaults + custom components + widgets
  const allComponents = useMemo(() => {
    const merged = { ...defaultComponents, ...components };

    // Add widgets as components
    Object.entries(widgetRegistry.getAll()).forEach(([tag, widget]) => {
      merged[tag] = (props) => (
        <Response content={widget.template} data={props} components={merged} />
      );
    });

    return merged;
  }, [widgetRegistry, components]);

  // Render template and parse
  const rendered = Object.keys(data).length > 0 
    ? renderTemplate(content, data) 
    : content;
  const blocks = parseContent(rendered);

  return <Renderer blocks={blocks} components={allComponents} />;
}
