import React, { useMemo } from "react";
import { MelonyMarkdown } from "./melony-markdown";
import { parseText } from "./text-parser";
import { renderJsonComponent } from "./component-renderer";
import { MelonyCardProps, ComponentData } from "./types";

/**
 * MelonyCard component that renders mixed content (text and JSON components)
 * 
 * This component parses text content to identify and render both markdown text
 * and JSON-defined components. It supports custom component registries and
 * configurable markdown rendering.
 */
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
