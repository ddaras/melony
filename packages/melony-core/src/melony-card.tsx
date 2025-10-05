import React, { useMemo } from "react";
import { parse as parsePartialJson } from "partial-json";
import { MelonyMarkdown } from "./melony-markdown";

export interface MelonyCardProps {
  text: string;
  components?: Record<string, React.FC<any>>;
  markdown?: {
    component: React.ComponentType<any>;
    props?: any;
  };
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
        // Check if we have a complete JSON object by finding the matching closing brace
        let braceCount = 0;
        let jsonEndIndex = -1;

        for (let i = 0; i < remainingText.length; i++) {
          if (remainingText[i] === "{") {
            braceCount++;
          } else if (remainingText[i] === "}") {
            braceCount--;
            if (braceCount === 0) {
              jsonEndIndex = i;
              break;
            }
          }
        }

        if (jsonEndIndex !== -1) {
          // Complete JSON object found
          segments.push({
            type: "json",
            data: parsed,
            originalText: remainingText.substring(0, jsonEndIndex + 1),
          });
          foundValidJson = true;
          currentIndex = startBrace + jsonEndIndex + 1;
        } else {
          // Partial JSON object - render it anyway
          segments.push({
            type: "json",
            data: parsed,
            originalText: remainingText,
          });
          foundValidJson = true;
          currentIndex = text.length; // Move to end of text since we're processing partial JSON
        }
      }
    } catch (error) {
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

  // Fall back to JSON
  return (
    <pre style={{ fontSize: "11px" }}>{JSON.stringify(data, null, 2)}</pre>
  );
};

export const MelonyCard: React.FC<MelonyCardProps> = ({
  text,
  components,
  markdown,
}) => {
  const segments = useMemo(() => parseText(text), [text]);

  const { component = MelonyMarkdown, props = {} } = markdown || {};

  const MarkdownComponent = component;

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
          <MarkdownComponent key={index} {...props}>
            {segment.originalText}
          </MarkdownComponent>
        );
      })}
    </>
  );
};
