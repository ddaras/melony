import { Event } from "./types";
import { generateId } from "./utils/generate-id";

export type { Event };
export { generateId };

export interface ClientState {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
}

export class MelonyClient {
  private transport: TransportFn;
  private state: ClientState;
  private abortController: AbortController | null = null;
  private stateListeners: Set<(state: ClientState) => void> = new Set();

  constructor(transport: TransportFn, options?: { initialEvents?: Event[] }) {
    this.transport = transport;
    this.state = {
      events: options?.initialEvents ?? [],
      isLoading: false,
      error: null,
    };
  }

  subscribe(listener: (state: ClientState) => void) {
    this.stateListeners.add(listener);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  getState() {
    return { ...this.state };
  }

  private setState(updates: Partial<ClientState>) {
    this.state = { ...this.state, ...updates };
    this.stateListeners.forEach((l) => l(this.getState()));
  }

  async *sendEvent(
    event: Event,
    options?: { runId?: string; state?: Record<string, any> }
  ): AsyncGenerator<Event> {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    const runId = options?.runId ?? generateId();
    const optimisticEvent: Event = {
      ...event,
      runId,
      role: event.role ?? "user",
      timestamp: event.timestamp ?? Date.now(),
    };

    this.setState({
      isLoading: true,
      error: null,
      events: [...this.state.events, optimisticEvent],
    });

    try {
      const stream = await this.transport(
        { event: optimisticEvent, ...options, runId },
        this.abortController.signal
      );

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const incomingEvent: Event = JSON.parse(line.slice(6));
            this.handleIncomingEvent(incomingEvent);
            yield incomingEvent;
          } catch (e) {
            console.error("Failed to parse event", e);
          }
        }
      }
      this.setState({ isLoading: false });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        this.setState({ isLoading: false });
        return;
      }
      const error = err instanceof Error ? err : new Error(String(err));
      this.setState({ error, isLoading: false });
      throw error;
    }
  }

  private handleIncomingEvent(event: Event) {
    const events = [...this.state.events];

    // Contiguous text-delta merging for the same run
    const lastEvent = events[events.length - 1];
    if (
      event.type === "text-delta" &&
      lastEvent?.type === "text-delta" &&
      event.runId === lastEvent.runId &&
      event.data?.delta
    ) {
      events[events.length - 1] = {
        ...lastEvent,
        data: {
          ...lastEvent.data,
          delta: (lastEvent.data?.delta || "") + event.data.delta,
        },
      };
    } else {
      events.push(event);
    }

    this.setState({ events });
  }

  reset(events: Event[] = []) {
    if (this.abortController) this.abortController.abort();
    this.setState({ events, error: null, isLoading: false });
  }
}

export interface TransportRequest {
  event: Event;
  runId?: string;
  state?: Record<string, any>;
}

export type TransportFn = (
  request: TransportRequest,
  signal?: AbortSignal
) => Promise<ReadableStream<Uint8Array>>;

export function createHttpTransport(api: string): TransportFn {
  return async (request: TransportRequest, signal?: AbortSignal) => {
    const response = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    if (!response.body) throw new Error("No response body");

    return response.body;
  };
}
