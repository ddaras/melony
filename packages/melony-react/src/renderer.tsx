import React, { useMemo } from "react";
import { UINode } from "@melony/core/browser";
import { createDefaultComponents } from "./default-components";

export interface RendererProps {
  nodes: string | UINode | UINode[];
  components?: Record<string, React.FC<any>>;
}

const DefaultUnknown: React.FC<any> = ({ componentName, children }) => (
  <div className="text-red-500 border border-red-200 p-2 my-2 rounded text-sm">
    Unknown component: {componentName}
    {children && (
      <div className="mt-1 pl-2 border-l-2 border-red-100">{children}</div>
    )}
  </div>
);

export function Renderer({ nodes, components }: RendererProps) {
  // Merge default components with provided components
  const allComponents = useMemo(() => {
    const defaults = createDefaultComponents();
    return { ...defaults, ...components };
  }, [components]);

  // Handle string content
  if (typeof nodes === "string") {
    return <span style={{ whiteSpace: "pre-wrap" }}>{nodes}</span>;
  }

  // Ensure nodes is an array
  const safeNodes = Array.isArray(nodes) ? nodes : [nodes];
  
  // Handle empty or invalid nodes
  if (!safeNodes || safeNodes.length === 0) return null;

  return <>{safeNodes.map((node, i) => renderNode(node, i, allComponents))}</>;
}

function renderNode(
  node: UINode | string, // Relax type for safety
  key: number,
  componentMap: Record<string, React.FC<any>>
): React.ReactNode {
  // Handle string nodes if they appear in children
  if (typeof node === "string") {
    return (
      <span key={key} style={{ whiteSpace: "pre-line" }}>
        {node}
      </span>
    );
  }

  // Handle potential null/undefined
  if (!node) return null;

  const Component =
    componentMap[node.type] || componentMap.unknown || DefaultUnknown;

  const children = node.children?.map((child, i) =>
    renderNode(child, i, componentMap)
  );

  if (Component === componentMap.unknown || Component === DefaultUnknown) {
    return (
      <Component key={key} componentName={node.type}>
        {children}
      </Component>
    );
  }

  return (
    <Component key={key} {...node.props}>
      {children}
    </Component>
  );
}
