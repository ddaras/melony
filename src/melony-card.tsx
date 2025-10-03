import React, { useMemo } from "react";
import { parse as parsePartialJson } from "partial-json";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MelonyCardProps {
  text: string;
  className?: string;
  components?: Record<string, React.FC<any>>;
}

interface ParsedContent {
  type: "text" | "json";
  data: any;
  originalText: string;
}

type ComponentData = { type: string; [key: string]: any };

// Parse the answer string to detect JSON
const parseText = (text: string): ParsedContent => {
  try {
    // Extract JSON portion starting from { and ending at the last } if it exists
    const startIndex = text.indexOf('{');
    if (startIndex === -1) {
      // No JSON object found, treat as text
      return {
        type: "text",
        data: null,
        originalText: text,
      };
    }
    
    const lastBraceIndex = text.lastIndexOf('}');
    const jsonText = lastBraceIndex !== -1 && lastBraceIndex > startIndex
      ? text.substring(startIndex, lastBraceIndex + 1)
      : text.substring(startIndex);
    
    const parsed = parsePartialJson(jsonText);

    if (parsed && typeof parsed === "object" && "type" in parsed) {
      return {
        type: "json",
        data: parsed,
        originalText: text,
      };
    }
  } catch (error) {
    // If parsing fails, treat as text
    console.warn("Failed to parse JSON:", error);
  }

  return {
    type: "text",
    data: null,
    originalText: text,
  };
};

// Main component renderer
const renderJsonComponent = (
  data: ComponentData,
  components?: Record<string, React.FC<any>>
) => {
  // Check for custom components first
  if (components && data.type in components) {
    const CustomComponent = components[data.type];

    return <CustomComponent {...data} />;
  }

  // Fall back to built-in components
  return null;
};

export const MelonyCard: React.FC<MelonyCardProps> = ({
  text,
  className,
  components,
}) => {
  const parsedContent = useMemo(() => parseText(text), [text]);

  if (parsedContent.type === "json" && parsedContent.data) {
    return (
      <div className={className}>
        {renderJsonComponent(parsedContent.data as ComponentData, components)}
      </div>
    );
  }

  // Render as markdown text
  return (
    <div className={`markdown-component ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {parsedContent.originalText}
      </ReactMarkdown>
    </div>
  );
};
