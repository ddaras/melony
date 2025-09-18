import {
  Message,
  StreamingEvent,
  SubscribeCallback,
  Subscription,
  StreamingHandler,
  StreamingHandlerOptions,
} from "./types";
import { MessageAssembler } from "./message-assembler";

export class GenericStreamingAdapter implements StreamingHandler {
  private endpoint: string;
  private headers: Record<string, string>;
  private debug: boolean;
  private subscribers = new Set<SubscribeCallback>();

  constructor(options: Partial<StreamingHandlerOptions> = {}) {
    this.endpoint = options.api || "";
    this.headers = options.headers || {};
    this.debug = (options as any)?.debug || false;
  }

  subscribe(callback: SubscribeCallback): Subscription {
    this.subscribers.add(callback);
    return { unsubscribe: () => this.subscribers.delete(callback) };
  }

  dispose(): void {
    this.subscribers.clear();
  }

  async send(message: string): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      await this.processStream(response.body);
    } catch (error) {
      this.emitError(error);
    }
  }

  private async processStream(body: ReadableStream<Uint8Array>): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    const messageAssembler = new MessageAssembler();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (this.debug) console.log("line", line);

          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim(); // Remove "data: " prefix
          if (!data) continue;
          if (data === "[DONE]") {
            // Finalize any remaining messages
            messageAssembler.getAllMessages().forEach((msg) => {
              this.emit(msg);
            });
            return;
          }

          let event: StreamingEvent;
          try {
            event = JSON.parse(data);
          } catch {
            if (this.debug)
              console.warn("Failed to parse streaming event:", data);
            continue;
          }

          const updatedMessage = messageAssembler.processEvent(event);
          if (updatedMessage) {
            this.emit(updatedMessage);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }


  private emit(message: Message): void {
    this.subscribers.forEach((cb) => cb(message));
  }

  private emitError(error: unknown): void {
    const msg = error instanceof Error ? error.message : "Unknown error";
    this.emit({
      id: crypto.randomUUID(),
      role: "assistant",
      parts: [{ type: "text", text: `Error: ${msg}` }],
      createdAt: Date.now(),
    });
  }
}
