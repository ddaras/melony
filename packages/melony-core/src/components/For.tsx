import React from "react";
import { useTheme } from "../theme";
import { ForProps } from "./component-types";
import { ContextProvider, useContextValue } from "../context-provider";
import { TemplateEngine, TemplateUtils } from "../template-engine";

/**
 * For Component - Renders a template for each item in an array
 *
 * Usage:
 * <for items={[1, 2, 3]}>
 *   <text value="{{item}}" />
 * </for>
 *
 * The component provides special context variables:
 * - {{item}} - Current array item
 * - {{index}} - Current index (0-based)
 * - {{isFirst}} - Boolean if first item
 * - {{isLast}} - Boolean if last item
 * - {{isEven}} - Boolean if even index
 * - {{isOdd}} - Boolean if odd index
 */
export const For: React.FC<ForProps> = ({
  items = [],
  children,
  itemKey,
  emptyMessage = "No items to display",
}) => {
  const theme = useTheme();

  const context = useContextValue();

  if (typeof items === "string") {
    // First render the template to resolve any variables
    const renderedItems = TemplateEngine.render(items, context);

    // Try to parse as JSON (handle HTML-encoded JSON)
    try {
      // Unescape HTML entities first (convert &quot; back to ")
      const unescapedItems = TemplateUtils.unescapeHtml(renderedItems);
      items = JSON.parse(unescapedItems);
    } catch (error) {
      // If JSON parsing fails, treat as a regular string
      console.warn("Failed to parse items as JSON:", error);
      items = renderedItems;
    }
  }

  // Handle empty array
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div
        style={{
          padding: theme.spacing?.md,
          color: theme.colors?.muted,
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  // Render each item
  return (
    <>
      {items.map((item, index) => {
        // Create context object with special variables
        const context = {
          item,
          index,
          isFirst: index === 0,
          isLast: index === items.length - 1,
          isEven: index % 2 === 0,
          isOdd: index % 2 === 1,
        };

        // Generate key for React
        const key = itemKey
          ? typeof item === "object" && item !== null
            ? item[itemKey]
            : item
          : index;

        // Render children with context
        return (
          <ForItemRenderer key={key} children={children} context={context} />
        );
      })}
    </>
  );
};

/**
 * Internal component to render children with context
 */
const ForItemRenderer: React.FC<{
  children: any;
  context: Record<string, any>;
}> = ({ children, context }) => {
  // Normalize children to always be an array
  const childrenArray = React.Children.toArray(children);

  // Render the processed children
  return (
    <>
      {childrenArray.map((child, index) => {
        return (
          <ContextProvider key={index} context={context}>
            {child}
          </ContextProvider>
        );
      })}
    </>
  );
};
