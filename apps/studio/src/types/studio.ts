export interface MelonyEvent {
  sequence?: number;
  timestamp: number;
  event: {
    type: string;
    data: any;
  };
  state: any;
  type: 'intercept' | 'emit';
}

export interface Run {
  runId: string;
  sessionId: string;
  agentName?: string;
  events: MelonyEvent[];
  startedAt: number;
  lastUpdatedAt: number;
  state: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export type RuntimeMessage = {
  role?: unknown;
  content?: unknown;
};

export type InspectorTab = 'payload' | 'state';

export interface TraceTone {
  dot: string;
  bar: string;
}

export interface TimelineRow {
  event: MelonyEvent;
  idx: number;
  startMs: number;
  durationMs: number;
  leftPercent: number;
  widthPercent: number;
  tone: TraceTone;
}

export interface RunGroup {
  sessionId: string;
  runs: Run[];
  lastUpdatedAt: number;
}
