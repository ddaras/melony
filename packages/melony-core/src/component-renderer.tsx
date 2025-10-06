import React from "react";
import { ComponentData } from "./types";

/**
 * Render JSON component data using custom components or fallback to JSON display
 * @param data - The component data to render (can be a single component or array)
 * @param components - Optional custom component registry
 * @returns JSX element representing the component(s)
 */
export const renderJsonComponent = (
  data: ComponentData | ComponentData[],
  components?: Record<string, React.FC<any>>
): React.JSX.Element => {
  // Handle arrays of components
  if (Array.isArray(data)) {
    return (
      <>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            {renderSingleComponent(item, components)}
          </React.Fragment>
        ))}
      </>
    );
  }

  return renderSingleComponent(data, components);
};

/**
 * Render a single component
 */
const renderSingleComponent = (
  data: ComponentData,
  components?: Record<string, React.FC<any>>
): React.JSX.Element => {
  // Check for custom components first
  if (components && data.type in components) {
    const CustomComponent = components[data.type];
    return <CustomComponent {...data} />;
  }

  // Fall back to JSON display
  return (
    <pre style={{ fontSize: "11px", lineHeight: "1.5" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};
