import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { markdownComponents } from "./markdown-components";
import { ContextProvider } from "./context-provider";
import { MelonyWidget } from "./melony-widget";
import { ComponentDef } from "./renderer";
import { MelonyParser } from "./parser";

const parser = new MelonyParser();

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

  // Parse the content to extract markdown text and component tags
  const blocks = useMemo(() => {
    return parser.parseContentAsBlocks(content);
  }, [content, parser]);

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
          // Delegate widget rendering to MelonyWidget
          return (
            <MelonyWidget key={`widget-${index}`} context={context}>
              {item as ComponentDef}
            </MelonyWidget>
          );
        }
      })}
    </ContextProvider>
  );
};
