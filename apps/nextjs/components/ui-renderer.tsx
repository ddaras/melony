import React from "react";
import { MelonyRenderer, UINode } from "@melony/ui-kit/client";

export interface UIRendererProps {
  node: UINode;
}

/**
 * Wrapper for the MelonyRenderer from the UI kit.
 * This keeps the local component interface consistent but uses the library implementation.
 */
export function UIRenderer({ node }: UIRendererProps) {
  return <MelonyRenderer node={node} />;
}
