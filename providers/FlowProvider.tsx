import React, { createContext, useContext } from 'react';
import type { FlowState } from '../core/flows';
import { useFlow } from '../hooks/useFlow';

interface FlowContextValue {
  state: FlowState;
  to: (s: FlowState) => void;
}

const FlowContext = createContext<FlowContextValue | null>(null);

export function FlowProvider({ children }: { children?: React.ReactNode }) {
  const value = useFlow('idle');
  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlowContext() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error('useFlowContext must be used within FlowProvider');
  return ctx;
}
