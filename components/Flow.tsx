import React from 'react';

export interface FlowProps {
  state: string;
  children?: React.ReactNode;
}

export function Flow({ state, children }: FlowProps) {
  return <section data-ai-flow-state={state}>{children}</section>;
}
