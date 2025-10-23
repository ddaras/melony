import React, { memo, useMemo } from "react";
import * as MelonyComponents from "./components";

/**
 * Component Definition
 * Defines the structure for declarative UI components
 */
export interface ComponentDef {
  component: string;
  props?: Record<string, any>;
  children?: Array<ComponentDef | string>;
}

/**
 * Renders a component definition into React elements
 */
export const renderComponent = (
  def: ComponentDef | string,
  key?: string | number
): React.ReactNode => {
  // Handle string children (text nodes)
  if (typeof def === "string") {
    return def;
  }

  // Get the component from the registry
  const Component = (MelonyComponents as any)[def.component];

  if (!Component) {
    console.warn(`Unknown component: ${def.component}`);
    return null;
  }

  // Recursively render children
  const renderedChildren = def.children?.map((child, index) =>
    renderComponent(child, index)
  );

  // Render the component with props and children
  return React.createElement(
    Component,
    { ...def.props, key: key ?? undefined },
    ...(renderedChildren || [])
  );
};

/**
 * Renders a component definition tree with memoization for better performance
 */
export const ComponentRenderer: React.FC<{
  definition: ComponentDef;
}> = memo(({ definition }) => {
  const renderedComponent = useMemo(() => {
    return renderComponent(definition);
  }, [definition]);

  return <>{renderedComponent}</>;
});

ComponentRenderer.displayName = "ComponentRenderer";
