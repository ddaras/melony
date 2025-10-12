import React from "react";

export interface MelonyCardProps {
  text: string;
  components?: Record<string, React.FC<any>>;
  markdown?: {
    component: React.ComponentType<any>;
    props?: any;
  };
  loadingComponent?: React.ComponentType<any>;
  disableMarkdown?: boolean;
}

export interface ParsedSegment {
  type: "text" | "json" | "loading";
  data: any;
  originalText: string;
}

export type ComponentData = { type: string; [key: string]: any };
