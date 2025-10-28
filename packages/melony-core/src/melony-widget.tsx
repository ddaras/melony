import { useMemo } from "react";
import { renderComponent, ComponentDef } from "./renderer";
import { ContextProvider } from "./context-provider";
import { MelonyParser } from "./parser";
import { useWidgets } from "./widgets-context";

export interface MelonyWidgetProps {
  children?: string | ComponentDef;
  context?: Record<string, any>;
}

/**
 * MelonyWidget - Renders widget components from string or ComponentDef
 * This is separate from MelonyMarkdown and focuses only on widget rendering
 */
export const MelonyWidget = ({ children, context = {} }: MelonyWidgetProps) => {
  const widgets = useWidgets();

  // Create parser with widget schemas
  const parser = useMemo(() => new MelonyParser(widgets), [widgets]);

  // Parse or use the provided content
  const blocks = useMemo(() => {
    if (!children) return [];

    // If children is already a ComponentDef, use it directly
    if (typeof children === "object" && "component" in children) {
      return [children];
    }

    // Parse string content into component definitions
    const blocks = parser.parseContentAsBlocks(children);

    // Filter out string blocks (we only render components here)
    return blocks.filter(
      (block): block is ComponentDef => typeof block !== "string"
    );
  }, [children, parser]);

  return (
    <ContextProvider context={context}>
      {blocks.map((component, index) =>
        renderComponent(component, `widget-${index}`)
      )}
    </ContextProvider>
  );
};
