import React from "react";

export interface MelonyCardProps {
  text: string;
  markdown?: {
    component: React.ComponentType<any>;
    props?: any;
  };
  loadingComponent?: React.ComponentType<any>;
  disableMarkdown?: boolean;
  onAction?: ActionHandler;
  theme?: Partial<any>; // Will be typed with MelonyTheme
}

export interface ParsedSegment {
  type: "text" | "component" | "composing";
  data: any;
  originalText: string;
}

export type ComponentData = { type: string; [key: string]: any };

// Action types
export interface ActionDefinition {
  action: string;
  payload?: Record<string, any>;
}

export type ActionHandler = (
  action: string,
  payload?: Record<string, any>
) => void | Promise<void>;
