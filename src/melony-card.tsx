import React, { useMemo } from "react";
import { parse as parsePartialJson } from "partial-json";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MelonyCardProps {
  text: string;
  components?: Record<string, React.FC<any>>;
}

interface ParsedSegment {
  type: "text" | "json";
  data: any;
  originalText: string;
}

type ComponentData = { type: string; [key: string]: any };

// Parse the text to extract mixed content (text and JSON)
const parseText = (text: string): ParsedSegment[] => {
  const segments: ParsedSegment[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    const startBrace = text.indexOf("{", currentIndex);

    // If no more JSON objects, add remaining text
    if (startBrace === -1) {
      if (currentIndex < text.length) {
        segments.push({
          type: "text",
          data: null,
          originalText: text.substring(currentIndex),
        });
      }
      break;
    }

    // Add text before the JSON object
    if (startBrace > currentIndex) {
      segments.push({
        type: "text",
        data: null,
        originalText: text.substring(currentIndex, startBrace),
      });
    }

    // Try to parse partial JSON directly from the remaining text
    const remainingText = text.substring(startBrace);
    let foundValidJson = false;

    try {
      const parsed = parsePartialJson(remainingText);
      if (parsed && typeof parsed === "object" && "type" in parsed) {
        segments.push({
          type: "json",
          data: parsed,
          originalText: text.substring(startBrace),
        });
      }
    } catch (error) {
      const endIndex = startBrace + remainingText.length;

      currentIndex = endIndex;
      foundValidJson = true;
      // JSON parsing failed, treat as regular text
    }

    // If no valid JSON found, treat the brace as regular text
    if (!foundValidJson) {
      segments.push({
        type: "text",
        data: null,
        originalText: text.substring(startBrace, startBrace + 1),
      });
      currentIndex = startBrace + 1;
    }
  }

  return segments;
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

export const MelonyCard: React.FC<MelonyCardProps> = ({ text, components }) => {
  const segments = useMemo(() => parseText(text), [text]);

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === "json" && segment.data) {
          return (
            <React.Fragment key={index}>
              {renderJsonComponent(segment.data as ComponentData, components)}
            </React.Fragment>
          );
        }

        // Render text as markdown
        return (
          <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
            {segment.originalText}
          </ReactMarkdown>
        );
      })}
    </>
  );
};
