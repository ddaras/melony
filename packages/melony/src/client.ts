import { Config, Event } from "./types";
import { generateId } from "./utils/generate-id";

export type { Event };
export { generateId };

export interface ClientState {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
  loadingStatus?: {
    message: string;
    details?: string;
  };
}

export interface MelonyClientOptions {
  url: string;
  initialEvents?: Event[];
  headers?:
    | Record<string, string>
    | (() => Record<string, string> | Promise<Record<string, string>>);
}

export class MelonyClient {
  private state: ClientState;
  public readonly url: string;
  private headers?: MelonyClientOptions["headers"];
  private lastServerState: any = null;
  private abortController: AbortController | null = null;
  private stateListeners: Set<(state: ClientState) => void> = new Set();

  constructor(options: MelonyClientOptions) {
    this.url = options.url;
    this.headers = options.headers;
    this.state = {
      events: options.initialEvents ?? [],
      isLoading: false,
      error: null,
      loadingStatus: undefined,
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

  async getConfig(): Promise<Config> {
    const headers = await this.getRequestHeaders();
    const response = await fetch(this.url, {
      method: "GET",
      headers,
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  private setState(updates: Partial<ClientState>) {
    this.state = { ...this.state, ...updates };
    this.stateListeners.forEach((l) => l(this.getState()));
  }

  async *sendEvent(
    event: Event
  ): AsyncGenerator<Event> {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    const runId = event.runId ?? generateId();
    const state = event.state ?? this.lastServerState;
    const optimisticEvent: Event = {
      ...event,
      runId,
      state,
      role: event.role ?? "user",
      timestamp: event.timestamp ?? Date.now(),
    };

    this.setState({
      isLoading: true,
      error: null,
      loadingStatus: undefined,
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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
            const incomingEvent: Event = JSON.parse(line.slice(6));
            this.handleIncomingEvent(incomingEvent);
            yield incomingEvent;
          } catch (e) {
            console.error("Failed to parse event", e);
          }
        }
      }
      this.setState({ isLoading: false, loadingStatus: undefined });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        this.setState({ isLoading: false, loadingStatus: undefined });
        return;
      }
      const error = err instanceof Error ? err : new Error(String(err));
      this.setState({ error, isLoading: false, loadingStatus: undefined });
      throw error;
    }
  }

  private handleIncomingEvent(event: Event) {
    if (event.state) {
      this.lastServerState = event.state;
    }
    const events = [...this.state.events];

    if (event.type === "loading-status") {
      const currentStatus = this.state.loadingStatus;
      const newMessage =
        event.data?.message ?? currentStatus?.message ?? "Processing...";
      const newDelta = event.data?.delta;

      let newDetails = currentStatus?.details ?? "";
      if (newDelta !== undefined) {
        newDetails += newDelta;
      } else if (event.data?.details !== undefined) {
        newDetails = event.data.details;
      }

      this.setState({
        loadingStatus: {
          message: newMessage,
          details: newDetails || undefined,
        },
      });
    }

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
    this.setState({
      events,
      error: null,
      isLoading: false,
      loadingStatus: undefined,
    });
  }
}
