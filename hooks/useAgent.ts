import { useMemo } from 'react';
import { AgentClient } from '../core/client';

export function useAgent(baseUrl: string) {
  const client = useMemo(() => new AgentClient({ baseUrl }), [baseUrl]);
  return { client };
}
