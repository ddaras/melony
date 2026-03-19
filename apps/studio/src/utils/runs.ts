import { Run, RunGroup } from '../types/studio';

export const formatSessionLabel = (sessionId: string): string => {
  if (!sessionId || sessionId === 'default') {
    return 'Default Session';
  }
  return `Session ${sessionId.slice(0, 8)}`;
};

export const groupRunsBySession = (runs: Map<string, Run>): RunGroup[] => {
  const sessionMap = new Map<string, Run[]>();
  for (const run of runs.values()) {
    const sessionId = run.sessionId || run.state?.sessionId || 'default';
    if (!sessionMap.has(sessionId)) {
      sessionMap.set(sessionId, []);
    }
    sessionMap.get(sessionId)!.push(run);
  }

  return Array.from(sessionMap.entries())
    .map(([sessionId, sessionRuns]) => ({
      sessionId,
      runs: sessionRuns.sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt),
      lastUpdatedAt: Math.max(...sessionRuns.map((run) => run.lastUpdatedAt))
    }))
    .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);
};
