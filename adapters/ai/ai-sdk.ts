import { Message } from "../../core/types";
import {
  AIAdapter,
  AIAdapterOptions,
  SubscribeCallback,
  Subscription,
} from "../../core/adapter";

interface AISDKEvent {
  type: string;
  id?: string;
  delta?: string;
  // Tool streaming specific fields
  toolCallId?: string;
  toolName?: string;
  inputTextDelta?: string;
  input?: Record<string, any>;
  output?: any;
  providerMetadata?: Record<string, any>;
}

// Minimal ai-sdk UIMessage compatible types (subset)
type AISDKUIMessageRole = "user" | "assistant" | "system";
type AISDKUITextPart = { type: "text"; text: string };
type AISDKUIReasoningPart = { type: "reasoning"; text: string };
type AISDKUIToolPart = {
  type: "tool";
  toolName: string;
  toolCallId: string;
  state:
    | "input-streaming"
    | "input-final"
    | "result-streaming"
    | "result-final";
  input?: Record<string, any>;
  inputText?: string;
  output?: any;
};
type AISDKUIPart = AISDKUITextPart | AISDKUIReasoningPart | AISDKUIToolPart;
type AISDKUIMessage = {
  id: string;
  role: AISDKUIMessageRole;
  metadata?: Record<string, any>;
  parts: AISDKUIPart[];
};

export class AISDKAdapter implements AIAdapter {
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

  async send(message: string): Promise<void> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        body: JSON.stringify({
          message,
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

  subscribe(callback: SubscribeCallback): Subscription {
    this.subscribers.add(callback);
    return {
      unsubscribe: () => this.subscribers.delete(callback),
    };
  }

  dispose(): void {
    this.subscribers.clear();
  }

  private async processStream(body: ReadableStream<Uint8Array>): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let currentMessage: Partial<Message> | null = null;
    let textContent = "";
    let toolCalls = new Map<string, any>(); // Track tool calls by ID

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              if (currentMessage) {
                this.emit(currentMessage as Message);
              }
              return;
            }

            const event = this.parseEvent(data);
            if (event) {
              const result = this.handleEvent(
                event,
                currentMessage,
                textContent,
                toolCalls
              );
              if (result.message) {
                currentMessage = result.message;
                textContent = result.textContent;
                if (result.shouldEmit) {
                  this.emit(currentMessage as Message);
                }
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private parseEvent(data: string): AISDKEvent | null {
    try {
      return JSON.parse(data);
    } catch (error) {
      if (this.debug) console.warn("Failed to parse event:", data);
      return null;
    }
  }

  private handleEvent(
    event: AISDKEvent,
    currentMessage: Partial<Message> | null,
    textContent: string,
    toolCalls: Map<string, any>
  ): {
    message: Partial<Message> | null;
    textContent: string;
    shouldEmit: boolean;
  } {
    if (this.debug) console.log(`[AI-SDK] ${event.type}`, event);

    switch (event.type) {
      case "start":
        return {
          message: {
            id: crypto.randomUUID(),
            role: "assistant",
            parts: [],
            createdAt: Date.now(),
          },
          textContent: "",
          shouldEmit: false,
        };

      case "text-start":
        if (
          currentMessage &&
          !currentMessage.parts?.find((p) => p.type === "text")
        ) {
          currentMessage.parts = [
            ...(currentMessage.parts || []),
            { type: "text", text: "" },
          ];
        }
        return { message: currentMessage, textContent, shouldEmit: false };

      case "text-delta":
        if (event.delta && currentMessage) {
          const newTextContent = textContent + event.delta;
          const textPart = currentMessage.parts?.find(
            (p) => p.type === "text"
          ) as { type: "text"; text: string } | undefined;
          if (textPart) {
            textPart.text = newTextContent;
          }
          return {
            message: currentMessage,
            textContent: newTextContent,
            shouldEmit: true,
          };
        }
        return { message: currentMessage, textContent, shouldEmit: false };

      case "start-step":
        return { message: currentMessage, textContent, shouldEmit: true };

      case "tool-input-start":
        if (event.toolCallId && event.toolName && currentMessage) {
          const toolCall = {
            id: event.toolCallId,
            name: event.toolName,
            status: "streaming" as const,
            inputStream: "",
          };
          toolCalls.set(event.toolCallId, toolCall);

          // Create tool message part
          const toolPart = {
            type: "tool" as const,
            toolCallId: event.toolCallId,
            status: "streaming",
            inputStream: "",
          };
          currentMessage.parts = [...(currentMessage.parts || []), toolPart];
        }
        return { message: currentMessage, textContent, shouldEmit: true };

      case "tool-input-delta":
        if (
          event.toolCallId &&
          event.inputTextDelta &&
          toolCalls.has(event.toolCallId)
        ) {
          const toolCall = toolCalls.get(event.toolCallId);
          toolCall.inputStream =
            (toolCall.inputStream || "") + event.inputTextDelta;
          toolCalls.set(event.toolCallId, toolCall);

          if (currentMessage) {
            // Update tool message part with input stream
            const toolPart = currentMessage.parts?.find(
              (p) =>
                p.type === "tool" && (p as any).toolCallId === event.toolCallId
            ) as
              | {
                  type: "tool";
                  toolCallId: string;
                  status: string;
                  inputStream?: string;
                }
              | undefined;

            if (toolPart) {
              toolPart.inputStream =
                (toolPart.inputStream || "") + event.inputTextDelta;
            }
          }
        }
        return { message: currentMessage, textContent, shouldEmit: true };

      case "tool-input-available":
        if (
          event.toolCallId &&
          event.input &&
          toolCalls.has(event.toolCallId)
        ) {
          const toolCall = toolCalls.get(event.toolCallId);
          toolCall.args = event.input;
          toolCall.status = "pending";
          toolCalls.set(event.toolCallId, toolCall);

          if (currentMessage) {
            // Update tool message part status
            const toolPart = currentMessage.parts?.find(
              (p) =>
                p.type === "tool" && (p as any).toolCallId === event.toolCallId
            ) as
              | {
                  type: "tool";
                  toolCallId: string;
                  status: string;
                  inputStream?: string;
                }
              | undefined;

            if (toolPart) {
              toolPart.status = "pending";
            }
          }
        }
        return { message: currentMessage, textContent, shouldEmit: true };

      case "tool-output-available":
        if (event.toolCallId && toolCalls.has(event.toolCallId)) {
          const toolCall = toolCalls.get(event.toolCallId);
          toolCall.status = "completed";
          toolCalls.set(event.toolCallId, toolCall);

          // Add tool result
          const toolResult = {
            output: event.output,
            toolCallId: event.toolCallId,
          };

          if (currentMessage) {
            // Update tool message part status
            const toolPart = currentMessage.parts?.find(
              (p) =>
                p.type === "tool" && (p as any).toolCallId === event.toolCallId
            ) as
              | {
                  type: "tool";
                  toolCallId: string;
                  status: string;
                  inputStream?: string;
                }
              | undefined;

            if (toolPart) {
              toolPart.status = "completed";
            }
          }
        }
        return { message: currentMessage, textContent, shouldEmit: true };

      case "finish-step":
        return { message: currentMessage, textContent, shouldEmit: true };

      case "finish":
        return { message: currentMessage, textContent, shouldEmit: true };

      default:
        return { message: currentMessage, textContent, shouldEmit: false };
    }
  }

  private emit(message: Message): void {
    this.subscribers.forEach((callback) => callback(message));
  }

  private emitError(error: unknown): void {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    this.emit({
      id: crypto.randomUUID(),
      role: "assistant",
      parts: [{ type: "text", text: `Error: ${errorMessage}` }],
      createdAt: Date.now(),
    });
  }
}
