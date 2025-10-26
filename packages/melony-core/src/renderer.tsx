import React, { memo, useMemo } from "react";
import * as MelonyComponents from "./components";

/**
 * Component Definition
 * Defines the structure for declarative Melony widget components
 */
export interface ComponentDef {
  component: string;
  props?: Record<string, any>;
  children?: ComponentDef[];
}

/**
 * Melony Widget Renderer
 * Renders a Melony widget component definition into React elements
 * 
 * This is the core renderer for Melony widgets, converting ComponentDef structures
 * into actual React components. It's used by MelonyWidget and MelonyMarkdown
 * for widget rendering.
 */
export const renderComponent = (
  def: ComponentDef,
  key?: string | number
): React.ReactNode => {
  // Get the component from the Melony component registry
  const Component = (MelonyComponents as any)[def.component];

  if (!Component) {
    console.warn(`Unknown Melony widget component: ${def.component}`);
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
 * Component Renderer (with memoization)
 * Renders a widget component definition tree with memoization for better performance
 * Useful for standalone widget rendering scenarios
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
