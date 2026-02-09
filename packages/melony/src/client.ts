import { Event } from "./types";
import { generateId } from "./utils/generate-id";

export type { Event };
export { generateId };

export interface ClientState<TEvent extends Event = Event> {
  events: TEvent[];
  streaming: boolean;
  error: Error | null;
  context: Record<string, any>;
}

export interface MelonyClientOptions<TEvent extends Event = Event> {
  url: string;
  initialEvents?: TEvent[];
  initialContext?: Record<string, any>;
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
      streaming: false,
      error: null,
      context: options.initialContext ?? {},
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

  async *send(
    event: TEvent,
    additionalBody?: Record<string, any>
  ): AsyncGenerator<TEvent> {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    const optimisticEvent: TEvent = {
      id: generateId(),
      ...event
    } as TEvent;

    this.setState({
      streaming: true,
      error: null,
      events: [...this.state.events, optimisticEvent],
    });

    try {
      const headers = await this.getRequestHeaders();
      const response = await fetch(this.url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          event: optimisticEvent,
          ...additionalBody,
        }),
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
            const handled = this.handleIncomingEvent(incomingEvent);
            if (!handled) continue;
            yield incomingEvent;
          } catch (e) {
            console.error("Failed to parse event", e);
          }
        }
      }
      this.setState({ streaming: false });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        this.setState({ streaming: false });
        return;
      }
      const error = err instanceof Error ? err : new Error(String(err));
      this.setState({ error, streaming: false });
      throw error;
    }
  }

  private handleIncomingEvent(event: TEvent) {
    const events = [...this.state.events];

    // Replace optimistic event if IDs match, otherwise push
    const index = event.id ? events.findIndex((e) => e.id === event.id) : -1;
    if (index !== -1) {
      events[index] = event;
    } else {
      events.push(event);
    }

    this.setState({ events });
    return true;
  }

  reset(events: TEvent[] = []) {
    this.stop();
    this.setState({
      events,
      error: null,
      streaming: false,
    });
  }

  stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
      this.setState({ streaming: false });
    }
  }
}
