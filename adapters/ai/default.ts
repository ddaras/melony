import { Message, StreamingEvent } from "../../core/types";
import {
  AIAdapter,
  AIAdapterOptions,
  SubscribeCallback,
  Subscription,
} from "../../core/adapter";

export class DefaultAdapter implements AIAdapter {
  private endpoint: string;
  private headers: Record<string, string>;
  private debug: boolean;
  private subscribers = new Set<SubscribeCallback>();

  constructor(options: Partial<AIAdapterOptions> = {}) {
    this.endpoint = options.endpoint || "";
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
    let currentMessage: Message | null = null;
    const messageMap = new Map<string, Message>(); // Track messages by their text ID

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("message\t")) continue;
          const data = line.slice(8).trim(); // Remove "message\t" prefix
          if (!data) continue;
          if (data === "[DONE]") {
            // Finalize any remaining messages
            messageMap.forEach((msg) => {
              msg.streamingState = {
                isStreaming: false,
                currentStep: "finish",
              };
              this.emit(msg);
            });
            return;
          }

          let event: StreamingEvent;
          try {
            event = JSON.parse(data);
          } catch {
            if (this.debug) console.warn("Failed to parse streaming event:", data);
            continue;
          }

          this.handleStreamingEvent(event, messageMap);
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private handleStreamingEvent(event: StreamingEvent, messageMap: Map<string, Message>): void {
    switch (event.type) {
      case "start":
        // Global start - could emit a system message or update global state
        break;

      case "start-step":
        // Step start - could indicate thinking or tool use is about to begin
        break;

      case "text-start":
        // Create a new message for this text stream
        const newMessage: Message = {
          id: event.id,
          role: "assistant",
          parts: [{ type: "text", text: "" }],
          createdAt: Date.now(),
          streamingState: { 
            isStreaming: true, 
            currentStep: "text-start",
            textId: event.id 
          },
          metadata: event.providerMetadata,
        };
        messageMap.set(event.id, newMessage);
        this.emit(newMessage);
        break;

      case "text-delta":
        // Append text to existing message
        const message = messageMap.get(event.id);
        if (message) {
          const textPart = message.parts.find(
            (p) => p.type === "text"
          ) as { type: "text"; text: string };
          if (textPart) {
            textPart.text += event.delta;
            message.streamingState = {
              isStreaming: true,
              currentStep: "text-streaming",
              textId: message.streamingState?.textId,
            };
            this.emit(message);
          }
        }
        break;

      case "text-end":
        // Mark text streaming as complete
        const endMessage = messageMap.get(event.id);
        if (endMessage) {
          endMessage.streamingState = {
            isStreaming: true,
            currentStep: "text-end",
            textId: endMessage.streamingState?.textId,
          };
          this.emit(endMessage);
        }
        break;

      case "finish-step":
        // Step completion
        // Could update any active messages or emit step completion
        break;

      case "finish":
        // Final completion - mark all messages as no longer streaming
        messageMap.forEach((msg) => {
          msg.streamingState = {
            isStreaming: false,
            currentStep: "finish",
          };
          this.emit(msg);
        });
        break;

      default:
        if (this.debug) console.warn("Unknown streaming event type:", event);
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

export default DefaultAdapter;
