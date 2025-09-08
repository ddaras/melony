// src/core/client.ts
import { Message } from "./messages";

type SubscribeCallback = (msg: Message) => void;

export interface AIClient {
  send: (message: Message) => void;
  subscribe: (cb: SubscribeCallback) => { unsubscribe: () => void };
}

export interface AIClientOptions {
  endpoint: string;
  headers?: Record<string, string>;
}

// Simple in-memory subscription manager
class SubscriptionManager {
  private callbacks = new Set<SubscribeCallback>();
  subscribe(cb: SubscribeCallback) {
    this.callbacks.add(cb);
    return { unsubscribe: () => this.callbacks.delete(cb) };
  }
  emit(msg: Message) {
    this.callbacks.forEach((cb) => cb(msg));
  }
}

export class DefaultAIClient implements AIClient {
  private endpoint: string;
  private headers?: Record<string, string>;
  private subs = new SubscriptionManager();
  // AI SDK backend: HTTP-only

  constructor(opts: AIClientOptions) {
    this.endpoint = opts.endpoint;
    this.headers = opts.headers;
  }

  // No WS/SSE initialization paths; responses are emitted from HTTP results

  send(message: Message) {
    fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((msg: Message) => this.subs.emit(msg));
  }

  subscribe(cb: SubscribeCallback) {
    return this.subs.subscribe(cb);
  }
}
