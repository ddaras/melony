import { Event } from "./types";
import { generateId } from "./utils/generate-id";

export type { Event };
export { generateId };

export interface ClientState<TEvent extends Event = Event> {
  events: TEvent[];
  isLoading: boolean;
  error: Error | null;
  loadingStatus?: {
    message: string;
    details?: string;
  };
}

export interface MelonyClientOptions<TEvent extends Event = Event> {
  url: string;
  initialEvents?: TEvent[];
  headers?:
  | Record<string, string>
  | (() => Record<string, string> | Promise<Record<string, string>>);
}

export class MelonyClient<TEvent extends Event = Event> {
  private state: ClientState<TEvent>;
  public readonly url: string;
  private headers?: MelonyClientOptions<TEvent>["headers"];
  private lastServerState: any = null;
  private abortController: AbortController | null = null;
  private stateListeners: Set<(state: ClientState<TEvent>) => void> = new Set();

  constructor(options: MelonyClientOptions<TEvent>) {
    this.url = options.url;
    this.headers = options.headers;
    this.state = {
      events: options.initialEvents ?? [],
      isLoading: false,
      error: null,
      loadingStatus: undefined,
    };
  }

  subscribe(listener: (state: ClientState<TEvent>) => void) {
    this.stateListeners.add(listener);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  getState() {
    return { ...this.state };
  }

  private async getRequestHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.headers) {
      const extraHeaders =
        typeof this.headers === "function"
          ? await this.headers()
          : this.headers;
      Object.assign(headers, extraHeaders);
    }
    return headers;
  }

  private setState(updates: Partial<ClientState<TEvent>>) {
    this.state = { ...this.state, ...updates };
    this.stateListeners.forEach((l) => l(this.getState()));
  }

  async *sendEvent(event: TEvent): AsyncGenerator<TEvent> {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    const runId = event.meta?.runId ?? generateId();
    const state = event.meta?.state ?? this.lastServerState;
    const optimisticEvent: TEvent = {
      ...event,
      meta: {
        ...event.meta,
        id: event.meta?.id ?? generateId(),
        runId,
        state,
        role: event.meta?.role ?? "user",
        timestamp: event.meta?.timestamp ?? Date.now(),
      },
    } as TEvent;

    this.setState({
      isLoading: true,
      error: null,
      events: [...this.state.events, optimisticEvent],
    });

    try {
      const headers = await this.getRequestHeaders();
      const response = await fetch(this.url, {
        method: "POST",
        headers,
        body: JSON.stringify({ event: optimisticEvent }),
        signal: this.abortController.signal,
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
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
            const incomingEvent: TEvent = JSON.parse(line.slice(6));
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

  private handleIncomingEvent(event: TEvent) {
    if (event.meta?.state) {
      this.lastServerState = event.meta.state;
    }

    const events = [...this.state.events];

    events.push(event);

    this.setState({ events });
  }

  reset(events: TEvent[] = []) {
    if (this.abortController) this.abortController.abort();
    this.setState({
      events,
      error: null,
      isLoading: false,
    });
  }
}
