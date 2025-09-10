import { Message } from "../../core/types";
import {
  AIAdapter,
  AIAdapterOptions,
  SubscribeCallback,
  Subscription,
} from "../../core/adapter";

// This adapter targets a backend built with `@openai/agents`.
// It expects an SSE stream of serialized "chunk" objects coming from
// result.toStream() on the server. Each SSE line uses the format:
//   data: { ...chunk }
// and ends with:
//   data: [DONE]
// We convert those chunks into our internal Message model and emit updates.

export class OpenAIAgentsAdapter implements AIAdapter {
  private endpoint: string;
  private headers: Record<string, string>;
  private debug: boolean;
  private subscribers = new Set<SubscribeCallback>();
  private body: Record<string, any>;

  constructor(options: AIAdapterOptions) {
    this.endpoint = options.endpoint;
    this.headers = options.headers || {};
    this.debug = options.debug || false;
    this.body = options.body || {};
  }

  subscribe(callback: SubscribeCallback): Subscription {
    this.subscribers.add(callback);
    return { unsubscribe: () => this.subscribers.delete(callback) };
  }

  dispose(): void {
    this.subscribers.clear();
  }

  async send(messages: Message[]): Promise<void> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        body: JSON.stringify({ messages, ...this.body }),
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

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data) continue;

          if (data === "[DONE]") {
            if (currentMessage) this.emit(currentMessage);
            return;
          }

          let chunk: any;
          try {
            chunk = JSON.parse(data);
          } catch {
            if (this.debug) console.warn("[agents] Failed to parse SSE:", data);
            continue;
          }

          // The exact structure of `chunk` depends on @openai/agents runtime.
          // We support a minimal mapping:
          // - text deltas -> append to assistant text part
          // - finish indication -> mark streamingState false

          if (!currentMessage) {
            currentMessage = {
              id: crypto.randomUUID(),
              role: "assistant",
              parts: [{ type: "text", text: "" }],
              createdAt: Date.now(),
              streamingState: { isStreaming: true, currentStep: "response" },
            };
          }

          // Heuristics for common fields in agent chunks
          const deltaText = chunk?.delta ?? chunk?.textDelta ?? chunk?.text;
          const finalText = chunk?.message ?? chunk?.content;
          const finishReason = chunk?.finishReason ?? chunk?.finish_reason;

          if (typeof deltaText === "string" && deltaText.length > 0) {
            const textPart = currentMessage.parts.find(
              (p) => p.type === "text"
            ) as { type: "text"; text: string } | undefined;
            if (textPart) {
              textPart.text += deltaText;
            }
            this.emit(currentMessage);
          }

          if (typeof finalText === "string" && finalText.length > 0) {
            const textPart = currentMessage.parts.find(
              (p) => p.type === "text"
            ) as { type: "text"; text: string } | undefined;
            if (textPart) {
              textPart.text += finalText;
            }
            this.emit(currentMessage);
          }

          if (finishReason || chunk?.type === "finish") {
            if (currentMessage?.streamingState) {
              currentMessage.streamingState.isStreaming = false;
            }
            this.emit(currentMessage);
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

export default OpenAIAgentsAdapter;


