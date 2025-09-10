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
        body: JSON.stringify({
          messages: this.toOpenAIChatMessages(messages),
          ...this.body,
        }),
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
    const processedSequences = new Set<string>();

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

          // Normalize the container and inner event
          const containerType: string | undefined = chunk?.type;
          const inner = chunk?.data ?? chunk; // sometimes payloads nest under data
          const innerType: string | undefined = inner?.type;

          if (!currentMessage) {
            currentMessage = {
              id: crypto.randomUUID(),
              role: "assistant",
              parts: [{ type: "text", text: "" }],
              createdAt: Date.now(),
              streamingState: { isStreaming: true, currentStep: "response" },
            };
          }

          const maybeAppendText = (text: string | undefined, seqKey?: string) => {
            if (typeof text !== "string" || text.length === 0) return;
            if (seqKey && processedSequences.has(seqKey)) return;
            const textPart = currentMessage!.parts.find(
              (p) => p.type === "text"
            ) as { type: "text"; text: string } | undefined;
            if (textPart) {
              textPart.text += text;
            }
            if (seqKey) processedSequences.add(seqKey);
            this.emit(currentMessage!);
          };

          const finish = () => {
            if (currentMessage?.streamingState) {
              currentMessage.streamingState.isStreaming = false;
            }
            this.emit(currentMessage!);
          };

          // Case 1: direct output_text_delta
          if (innerType === "output_text_delta") {
            const seq = inner?.providerData?.sequence_number;
            maybeAppendText(inner?.delta, `output_text.delta:${seq}`);
            continue;
          }

          // Case 2: model event
          if (innerType === "model" && inner?.event) {
            const ev = inner.event;
            if (typeof ev?.type === "string") {
              if (ev.type.endsWith("output_text.delta")) {
                maybeAppendText(ev?.delta, `output_text.delta:${ev?.sequence_number}`);
              } else if (ev.type.endsWith("output_text.done")) {
                // Some streams send the final full text here
                maybeAppendText(ev?.text);
              } else if (ev.type === "response.completed") {
                finish();
              }
            }
            continue;
          }

          // Case 3: response_done (aggregated final payload)
          if (innerType === "response_done") {
            const text = inner?.response?.output?.[0]?.content?.[0]?.text;
            if (text) maybeAppendText(text);
            finish();
            continue;
          }

          // Case 4: run item event with message_output_created
          if (containerType === "run_item_stream_event" && chunk?.name === "message_output_created") {
            const text = chunk?.item?.rawItem?.content?.[0]?.text;
            if (text) maybeAppendText(text);
            finish();
            continue;
          }

          // Generic heuristics as fallback
          const deltaText = inner?.delta ?? inner?.textDelta ?? inner?.text ?? chunk?.delta ?? chunk?.text;
          if (typeof deltaText === "string") {
            maybeAppendText(deltaText);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private toOpenAIChatMessages(messages: Message[]): Array<{ role: "system" | "user" | "assistant"; content: string }> {
    const result: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];
    for (const m of messages) {
      const role = (m.role === "system" || m.role === "assistant" || m.role === "user") ? m.role : "user";
      const text = (m.parts || [])
        .filter((p) => p.type === "text" || p.type === "thinking")
        .map((p) => (p as any).text)
        .join("\n\n");
      if (text.length > 0) {
        result.push({ role, content: text });
      }
    }
    return result;
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


