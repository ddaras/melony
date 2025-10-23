import React, { useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { ThemeProvider } from "./theme";
import { ActionProvider } from "./action-context";
import { MelonyTheme } from "./theme";
import { ActionHandler } from "./types";
import remarkGfm from "remark-gfm";
import yaml from "js-yaml";
import { renderComponent, ComponentDef } from "./renderer";
import rehypeRaw from "rehype-raw";
import { markdownComponents } from "./markdown-components";

const getNodeText = (node: any): string => {
  if (!node) return "";
  if (node.type === "text") {
    return node.value;
  }
  if (node.children) {
    return node.children.map(getNodeText).join("");
  }
  return "";
};

// Helper function to generate a cache key based on YAML content
const generateCacheKey = (yamlContent: string): string => {
  // Use a more robust approach for streaming content
  const lines = yamlContent.split("\n").filter((line) => line.trim());

  // Extract component name and key properties for better caching
  const componentLine = lines.find((line) =>
    line.trim().startsWith("component:")
  );
  const componentName = componentLine
    ? componentLine.split(":")[1]?.trim()
    : "unknown";

  // Use component name + first few lines for better cache hits during streaming
  const keyContent = `${componentName}-${lines.slice(0, 2).join("|")}`;

  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < keyContent.length; i++) {
    const char = keyContent.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
};

// Helper function to check if YAML content looks complete
const isYamlContentComplete = (yamlContent: string): boolean => {
  const trimmed = yamlContent.trim();
  if (!trimmed) return false;

  // Check if it starts with a component definition
  if (!trimmed.match(/^\s*component\s*:/)) return false;

  // Check if it has proper YAML structure (basic validation)
  try {
    yaml.load(trimmed);
    return true;
  } catch {
    return false;
  }
};

export interface MarkdownProps {
  className?: string;
  children: string | undefined | null;
  components?: Partial<Components>;
  style?: React.CSSProperties;
  theme?: MelonyTheme;
  onAction?: ActionHandler;
}

export const MelonyMarkdown = ({
  children,
  components = {},
  theme,
  onAction,
}: MarkdownProps) => {
  // Use ref to store component cache per instance
  const componentCacheRef = useRef<Map<string, React.ReactNode>>(new Map());

  // Enhanced render function with instance-specific caching
  const renderMelonyComponentWithCache = useCallback((yamlContent: string) => {
    const cacheKey = generateCacheKey(yamlContent);
    const cache = componentCacheRef.current;

    try {
      // Pre-process to automatically quote strings with special characters
      const lines = yamlContent.split("\n");
      const processedYaml = lines
        .map((line) => {
          const match = line.match(/^(\s*)(\w+):\s*(.+)$/);
          if (match) {
            const [, indent, key, value] = match;
            const trimmedValue = value.trim();

            if (
              !trimmedValue.match(/^["'`]/) &&
              trimmedValue.includes(":") &&
              !trimmedValue.includes("component:") &&
              !trimmedValue.includes("props:") &&
              !trimmedValue.includes("children:") &&
              !trimmedValue.includes("action:") &&
              !trimmedValue.includes("payload:") &&
              !trimmedValue.includes("onClickAction:") &&
              !trimmedValue.includes("onChangeAction:") &&
              !trimmedValue.includes("onSubmitAction:")
            ) {
              return `${indent}${key}: "${trimmedValue}"`;
            }
          }
          return line;
        })
        .join("\n");

      const componentDef = yaml.load(processedYaml) as ComponentDef;
      const renderedComponent = renderComponent(
        componentDef,
        `melony-${Math.random()}`
      );

      // Cache the successfully rendered component
      cache.set(cacheKey, renderedComponent);

      return renderedComponent;
    } catch (error) {
      // Check if we have a cached version of a similar component
      const cachedComponent = cache.get(cacheKey);
      if (cachedComponent) {
        return cachedComponent;
      }

      // If no cache and content doesn't look complete, return a placeholder
      if (!isYamlContentComplete(yamlContent)) {
        return (
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "16px",
              backgroundColor: "#f8fafc",
              color: "#64748b",
              fontSize: "14px",
              fontStyle: "italic",
            }}
          >
            Loading component...
          </div>
        );
      }

      // If content looks complete but parsing failed, show error
      return (
        <div
          style={{
            border: "1px solid #ff6b6b",
            borderRadius: "4px",
            padding: "12px",
            backgroundColor: "#fff5f5",
          }}
        >
          <div
            style={{
              color: "#e53e3e",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Melony Component Error
          </div>
          <pre
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#666",
              whiteSpace: "pre-wrap",
            }}
          >
            {yamlContent}
          </pre>
          <div
            style={{
              fontSize: "12px",
              color: "#e53e3e",
              marginTop: "8px",
            }}
          >
            {error instanceof Error ? error.message : "Invalid YAML syntax"}
          </div>
        </div>
      );
    }
  }, []);

  // Custom code block renderer for melony language
  const customComponents: Components = {
    ...markdownComponents,
    ...components,
    section: ({ node, children, ...props }) => {
      // The `props` object contains the HTML attributes.
      // Let's check for our custom data attribute here.
      // @ts-expect-error - data-melony-widget is a custom prop
      if (props["data-melony-widget"] !== undefined) {
        const yamlContent = getNodeText(node);
        return (
          <section {...props}>
            {renderMelonyComponentWithCache(yamlContent.trim())}
          </section>
        );
      }

      return <section {...props}>{children}</section>;
    },
  } as Components;

  return (
    <ThemeProvider theme={theme}>
      <ActionProvider onAction={onAction}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={customComponents}
        >
          {children || ""}
        </ReactMarkdown>
      </ActionProvider>
    </ThemeProvider>
  );
};
