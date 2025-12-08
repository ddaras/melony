import React from "react";
import * as MelonyComponents from "./components";

// Convert PascalCase to kebab-case (e.g., RadioGroup -> radio-group, ListItem -> list-item)
const pascalToKebab = (str: string): string => {
  return str
    .replace(/([A-Z])/g, "-$1") // Insert hyphen before capital letters
    .toLowerCase() // Convert to lowercase
    .replace(/^-/, ""); // Remove leading hyphen if present
};

// Dynamically create defaultComponents from all exported components
// Converts PascalCase component names to kebab-case keys (e.g., RadioGroup -> radio-group)
export const createDefaultComponents = (): Record<string, React.FC<any>> => {
  const components: Record<string, React.FC<any>> = {};

  // Iterate over all exports from MelonyComponents
  Object.entries(MelonyComponents).forEach(([name, component]) => {
    // Skip non-component exports (like types)
    if (
      typeof component === "function" ||
      (component && typeof component === "object" && "$$typeof" in component)
    ) {
      // Convert PascalCase to kebab-case (e.g., "RadioGroup" -> "radio-group")
      const key = pascalToKebab(name);
      components[key] = component as React.FC<any>;
    }
  });

  // Add fallback for unknown components
  components.unknown = ({
    componentName,
    children,
  }: {
    componentName?: string;
    children?: React.ReactNode;
  }) => {
    // Production: Don't show red error boxes to users
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      // Just render children if possible, or nothing
      return <>{children}</>;
    }

    // Development: Show the red box so you can fix it
    return (
      <div className="text-red-500 border border-red-200 p-2 my-2 rounded text-sm">
        Unknown component: {componentName}
        {children && (
          <div className="mt-1 pl-2 border-l-2 border-red-100">{children}</div>
        )}
      </div>
    );
  };

  return components;
};
