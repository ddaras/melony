import React from "react";
import { ComponentData } from "./types";
import * as BUILT_IN_COMPONENTS from "./built-in-components";

/**
 * Render JSON component data with support for nested components
 * @param data - The component data to render (can be a single component or array)
 * @param components - Optional custom component registry
 * @returns JSX element representing the component(s)
 */
export const renderJsonComponent = (
  data: ComponentData | ComponentData[]
): React.JSX.Element => {
  // Handle arrays of components
  if (Array.isArray(data)) {
    return (
      <>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            {renderSingleComponent(item)}
          </React.Fragment>
        ))}
      </>
    );
  }

  return renderSingleComponent(data);
};

/**
 * Recursively process props to render nested components
 */
const processProps = (props: any): any => {
  const processed: any = { ...props };

  for (const [key, value] of Object.entries(props)) {
    // Skip the 'type' field
    if (key === "type") continue;

    // Handle nested component objects
    if (value && typeof value === "object" && "type" in value) {
      processed[key] = renderSingleComponent(value as ComponentData);
    }
    // Handle arrays that might contain components
    else if (Array.isArray(value)) {
      processed[key] = value.map((item, idx) => {
        if (item && typeof item === "object" && "type" in item) {
          return (
            <React.Fragment key={idx}>
              {renderSingleComponent(item as ComponentData)}
            </React.Fragment>
          );
        }
        return item;
      });
    }
    // Handle special 'children' prop that might be an array of components
    else if (key === "children") {
      if (Array.isArray(value)) {
        processed[key] = value.map((item, idx) => {
          if (item && typeof item === "object" && "type" in item) {
            return (
              <React.Fragment key={idx}>
                {renderSingleComponent(item as ComponentData)}
              </React.Fragment>
            );
          }
          return item;
        });
      } else if (value && typeof value === "object" && "type" in value) {
        processed[key] = renderSingleComponent(value as ComponentData);
      }
    }
  }

  return processed;
};

/**
 * Render a single component with support for built-in and custom components
 */
const renderSingleComponent = (data: ComponentData): React.JSX.Element => {
  // Check for built-in components
  if (data.type in BUILT_IN_COMPONENTS) {
    const BuiltInComponent =
      BUILT_IN_COMPONENTS[data.type as keyof typeof BUILT_IN_COMPONENTS];
    const processedProps = processProps(data);
    return <BuiltInComponent {...processedProps} />;
  }

  // Fall back to JSON display
  return (
    <pre style={{ fontSize: "11px", lineHeight: "1.5" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};
