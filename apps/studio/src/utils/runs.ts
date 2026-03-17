import { MelonyEvent, Run, RunGroup, TimelineRow, TraceTone } from '../types/studio';

export const compareRunEvents = (a: MelonyEvent, b: MelonyEvent): number => {
  const aSeq = typeof a.sequence === 'number' ? a.sequence : Number.MAX_SAFE_INTEGER;
  const bSeq = typeof b.sequence === 'number' ? b.sequence : Number.MAX_SAFE_INTEGER;
  if (aSeq !== bSeq) {
    return aSeq - bSeq;
  }
  return a.timestamp - b.timestamp;
};

export const formatSessionLabel = (sessionId: string): string => {
  if (!sessionId || sessionId === 'default') {
    return 'Default Session';
  }
  return `Session ${sessionId.slice(0, 8)}`;
};

export const getTraceTone = (eventType: string): TraceTone => {
  const normalized = eventType.toLowerCase();
  if (normalized.includes('error')) {
    return { dot: 'bg-rose-400', bar: 'bg-rose-400/45' };
  }
  if (normalized.includes('llm')) {
    return { dot: 'bg-violet-400', bar: 'bg-violet-400/40' };
  }
  if (normalized.includes('action')) {
    return { dot: 'bg-amber-300', bar: 'bg-amber-300/40' };
  }
  return { dot: 'bg-emerald-400', bar: 'bg-emerald-400/40' };
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

export const getRunDurationMs = (selectedRun: Run | null): number => {
  if (!selectedRun || selectedRun.events.length === 0) {
    return 0;
  }
  const firstTimestamp = selectedRun.startedAt || selectedRun.events[0].timestamp;
  const lastTimestamp = Math.max(
    selectedRun.lastUpdatedAt,
    selectedRun.events[selectedRun.events.length - 1].timestamp
  );
  return Math.max(0, lastTimestamp - firstTimestamp);
};

export const createTimelineRows = (selectedRun: Run | null, showIntercepts: boolean): TimelineRow[] => {
  if (!selectedRun || selectedRun.events.length === 0) {
    return [];
  }

  const runStart = selectedRun.startedAt || selectedRun.events[0].timestamp;
  const runEnd = Math.max(
    selectedRun.lastUpdatedAt,
    selectedRun.events[selectedRun.events.length - 1].timestamp + 1
  );
  const totalDuration = Math.max(1, runEnd - runStart);

  return selectedRun.events
    .map((event, idx) => {
      const nextEvent = selectedRun.events[idx + 1];
      const startMs = Math.max(0, event.timestamp - runStart);
      const rawDurationMs = nextEvent
        ? Math.max(1, nextEvent.timestamp - event.timestamp)
        : Math.max(1, runEnd - event.timestamp);

      const leftPercent = Math.min(100, (startMs / totalDuration) * 100);
      const requestedWidth = Math.max(0.9, (rawDurationMs / totalDuration) * 100);
      const widthPercent = Math.max(0.9, Math.min(100 - leftPercent, requestedWidth));

      return {
        event,
        idx,
        startMs,
        durationMs: rawDurationMs,
        leftPercent,
        widthPercent,
        tone: getTraceTone(event.event.type)
      };
    })
    .filter((row) => showIntercepts || row.event.type !== 'intercept');
};
