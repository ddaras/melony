import React from 'react';

export interface ToolResponseProps {
  name: string;
  children?: React.ReactNode;
}

export function ToolResponse({ name, children }: ToolResponseProps) {
  return <div data-ai-tool-response={name}>{children}</div>;
}
