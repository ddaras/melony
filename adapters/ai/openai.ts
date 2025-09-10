import { Message } from "../../core/types";
import {
  AIAdapter,
  AIAdapterOptions,
  SubscribeCallback,
  Subscription,
} from "../../core/adapter";

type OpenAIChatRole = "system" | "user" | "assistant" | "tool";

type OpenAIChatMessage =
  | { role: OpenAIChatRole; content: string }
  | { role: "tool"; content: string; tool_call_id?: string };

export class OpenAIAdapter implements AIAdapter {
  private apiKey: string | undefined;
  private baseURL: string;
  private model: string;
  private headers: Record<string, string>;
  private debug: boolean;
  private subscribers = new Set<SubscribeCallback>();

  constructor(options: Partial<AIAdapterOptions & { apiKey?: string; baseURL?: string; model?: string }> = {}) {
    this.apiKey = options.apiKey;
    this.baseURL = options.baseURL || "https://api.openai.com/v1";
    this.model = (options as any)?.model || "gpt-4o-mini";
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

  async send(messages: Message[]): Promise<void> {
    try {
      if (!this.apiKey) {
        throw new Error("Missing OPENAI_API_KEY for OpenAIAdapter");
      }

      const payload = {
        model: this.model,
        messages: this.toOpenAIChatMessages(messages),
        stream: true,
      } as const;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          ...this.headers,
        },
        body: JSON.stringify(payload),
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

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data) continue;
          if (data === "[DONE]") {
            if (currentMessage) this.emit(currentMessage);
            return;
          }
          let parsed: any;
          try {
            parsed = JSON.parse(data);
          } catch {
            if (this.debug) console.warn("Failed to parse SSE data:", data);
            continue;
          }

          // OpenAI chat.completions stream delta
          const delta = parsed?.choices?.[0]?.delta;
          const finishReason = parsed?.choices?.[0]?.finish_reason;

          if (!currentMessage) {
            currentMessage = {
              id: crypto.randomUUID(),
              role: "assistant",
              parts: [{ type: "text", text: "" }],
              createdAt: Date.now(),
              streamingState: { isStreaming: true, currentStep: "response" },
            };
          }

          if (delta?.content) {
            const textPart = currentMessage.parts.find((p) => p.type === "text") as { type: "text"; text: string };
            textPart.text += delta.content as string;
            this.emit(currentMessage);
          }

          if (finishReason) {
            currentMessage.streamingState = { isStreaming: false, currentStep: "response" };
            this.emit(currentMessage);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private toOpenAIChatMessages(messages: Message[]): OpenAIChatMessage[] {
    const result: OpenAIChatMessage[] = [];
    for (const m of messages) {
      const role: OpenAIChatRole = m.role === "system" || m.role === "assistant" || m.role === "user" ? m.role : "user";

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

export default OpenAIAdapter;


