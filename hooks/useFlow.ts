import { useState, useCallback } from 'react';
import type { FlowState } from '../core/flows';

export function useFlow(initial: FlowState = 'idle') {
  const [state, setState] = useState<FlowState>(initial);
  const to = useCallback((next: FlowState) => setState(next), []);
  return { state, to };
}
