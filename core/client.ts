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
  method?: "ws" | "sse" | "http";
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
  private method: "ws" | "sse" | "http";
  private subs = new SubscriptionManager();
  private ws?: WebSocket;
  private sse?: EventSource;

  constructor(opts: AIClientOptions) {
    this.endpoint = opts.endpoint;
    this.headers = opts.headers;
    this.method = opts.method || "sse";

    if (this.method === "ws") this.initWS();
    if (this.method === "sse") this.initSSE();
  }

  private initWS() {
    this.ws = new WebSocket(this.endpoint);
    this.ws.onmessage = (e) => {
      try {
        const msg: Message = JSON.parse(e.data);
        this.subs.emit(msg);
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };
  }

  private initSSE() {
    this.sse = new EventSource(this.endpoint);
    this.sse.onmessage = (e) => {
      try {
        const msg: Message = JSON.parse(e.data);
        this.subs.emit(msg);
      } catch (err) {
        console.error("Failed to parse SSE message", err);
      }
    };
  }

  send(message: Message) {
    if (this.method === "ws" && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else if (this.method === "http") {
      fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        body: JSON.stringify(message),
      })
        .then((res) => res.json())
        .then((msg: Message) => this.subs.emit(msg));
    } else if (this.method === "sse") {
      // SSE is read-only; you send via HTTP fallback
      fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.headers },
        body: JSON.stringify(message),
      })
        .then((res) => res.json())
        .then((msg: Message) => this.subs.emit(msg));
    }
  }

  subscribe(cb: SubscribeCallback) {
    return this.subs.subscribe(cb);
  }
}
