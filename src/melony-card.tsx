import React, { useMemo } from "react";
import { parse as parsePartialJson } from "partial-json";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MelonyCardProps {
  text: string;
  className?: string;
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
    const startBrace = text.indexOf('{', currentIndex);
    
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
    
    // Try to find the matching closing brace
    let braceCount = 0;
    let endBrace = startBrace;
    let foundValidJson = false;
    
    // Try to parse JSON from this point
    for (let i = startBrace; i < text.length; i++) {
      if (text[i] === '{') braceCount++;
      if (text[i] === '}') braceCount--;
      
      if (braceCount === 0) {
        endBrace = i;
        const jsonText = text.substring(startBrace, endBrace + 1);
        
        try {
          const parsed = parsePartialJson(jsonText);
          if (parsed && typeof parsed === "object" && "type" in parsed) {
            segments.push({
              type: "json",
              data: parsed,
              originalText: jsonText,
            });
            foundValidJson = true;
            currentIndex = endBrace + 1;
            break;
          }
        } catch (error) {
          // Continue searching for a valid JSON
        }
      }
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

export const MelonyCard: React.FC<MelonyCardProps> = ({
  text,
  className,
  components,
}) => {
  const segments = useMemo(() => parseText(text), [text]);

  return (
    <div className={className}>
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
          <div key={index} className="markdown-component">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {segment.originalText}
            </ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
};
