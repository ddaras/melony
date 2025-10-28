import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { markdownComponents } from "./markdown-components";
import { ContextProvider } from "./context-provider";
import { renderComponent } from "./renderer";
import { MelonyParser } from "./parser";
import { useWidgets } from "./widgets-context";

export interface MarkdownProps {
  children: string | undefined | null;
  components?: Partial<Components>;
  context?: Record<string, any>;
}

/**
 * MelonyMarkdown - Renders markdown content with optional embedded widgets
 * This component focuses on markdown rendering and delegates widget rendering to MelonyWidget
 */
export const MelonyMarkdown = ({
  children,
  components = {},
  context = {},
}: MarkdownProps) => {
  const content = children || "";
  const widgets = useWidgets();

  // Create parser with widget schemas
  const parser = useMemo(() => new MelonyParser(widgets), [widgets]);

  // Parse the content to extract markdown text and component tags with context
  const blocks = useMemo(() => {
    return parser.parseContentAsBlocks(content, context);
  }, [content, context, parser]);

  // Custom component renderer for regular markdown with Melony components
  const customComponents: Components = {
    ...markdownComponents,
    ...components,
  } as Components;

  return (
    <ContextProvider context={context}>
      {blocks.map((item, index) => {
        if (typeof item === "string") {
          // Render markdown text
          return (
            <ReactMarkdown
              key={`markdown-${index}`}
              remarkPlugins={[remarkGfm]}
              components={customComponents}
            >
              {item}
            </ReactMarkdown>
          );
        } else {
          // Render the component
          return renderComponent(item, `widget-${index}`);
        }
      })}
    </ContextProvider>
  );
};
