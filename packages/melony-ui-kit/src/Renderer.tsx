'use client';

import React from "react";
import { UINode } from "./types";
import { useMelonyUI } from "./context";

export interface MelonyRendererProps {
  node: UINode;
}

export function MelonyRenderer({ node }: MelonyRendererProps) {
  const { components } = useMelonyUI();
  const { type, props, children } = node;

  const Component = components[type as keyof typeof components];

  if (!Component) {
    return (
      <div style={{ 
        color: "red", 
        fontStyle: "italic", 
        fontSize: "0.875rem", 
        padding: "0.5rem", 
        border: "1px dashed rgba(255, 0, 0, 0.5)", 
        borderRadius: "0.25rem", 
        backgroundColor: "rgba(255, 0, 0, 0.05)" 
      }}>
        [Unknown component: {type}]
      </div>
    );
  }

  // Recursively render children
  const renderedChildren = children?.map((child, i) => (
    <MelonyRenderer key={i} node={child} />
  ));

  return <Component {...(props as any)}>{renderedChildren}</Component>;
}
