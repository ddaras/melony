import React, { useMemo } from "react";
import { MelonyMarkdown } from "./melony-markdown";
import { parseText } from "./text-parser";
import { renderJsonComponent } from "./component-renderer";
import { MelonyCardProps, ComponentData } from "./types";

/**
 * Default loading component
 */
const DefaultLoadingComponent: React.FC = () => (
  <div style={{ 
    padding: "8px 0",
  }}>
    <div style={{
      display: "inline-block",
      fontSize: "14px",
      background: "linear-gradient(90deg, #999 25%, #333 50%, #999 75%)",
      backgroundSize: "200% 100%",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "shimmer 3s ease-in-out infinite"
    }}>
      Composing component
    </div>
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

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
  loadingComponent,
  disableMarkdown = false,
}) => {
  const segments = useMemo(() => parseText(text), [text]);

  const { component = MelonyMarkdown, props = {} } = markdown || {};
  const MarkdownComponent = component;
  const LoadingComponent = loadingComponent || DefaultLoadingComponent;

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

        if (segment.type === "loading") {
          return (
            <React.Fragment key={index}>
              <LoadingComponent />
            </React.Fragment>
          );
        }

        // Render text as markdown or plain text
        if (disableMarkdown) {
          return (
            <React.Fragment key={index}>
              {segment.originalText}
            </React.Fragment>
          );
        }

        return (
          <MarkdownComponent key={index} {...props}>
            {segment.originalText}
          </MarkdownComponent>
        );
      })}
    </>
  );
};
