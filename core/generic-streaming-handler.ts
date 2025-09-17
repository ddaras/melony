import {
  Message,
  StreamingEvent,
  ToolMessagePart,
  SubscribeCallback,
  Subscription,
  StreamingHandler,
  StreamingHandlerOptions,
} from "./types";

export class GenericStreamingAdapter implements StreamingHandler {
  private endpoint: string;
  private headers: Record<string, string>;
  private debug: boolean;
  private subscribers = new Set<SubscribeCallback>();

  constructor(options: Partial<StreamingHandlerOptions> = {}) {
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
    const messageMap = new Map<string, Message>(); // Track messages by their text ID

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
            messageMap.forEach((msg) => {
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

          this.handleStreamingEvent(event, messageMap);
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private handleStreamingEvent(
    event: StreamingEvent,
    messageMap: Map<string, Message>
  ): void {
    switch (event.type) {
      case "start":
        // Global start - could emit a system message or update global state
        this.emit({
          id: event.id,
          role: "assistant",
          parts: [{ type: "text", text: "Thinking..." }],
          createdAt: Date.now(),
          metadata: {},
        });
        break;

      case "start-step":
        // Step start - could indicate thinking or tool use is about to begin
        break;

      case "text-start":
        // Create a new message for this text stream
        const newMessage: Message = {
          id: event.id,
          role: "assistant",
          parts: [
            ...(messageMap.get(event.id)?.parts || []),
            { type: "text", text: "" },
          ],
          createdAt: Date.now(),
          metadata: {},
        };
        messageMap.set(event.id, newMessage);
        this.emit(newMessage);
        break;

      case "text-delta":
        // Append text to existing message
        const message = messageMap.get(event.id);
        if (message) {
          const textPart = message.parts.find((p) => p.type === "text");
          if (textPart) {
            textPart.text += event.delta;
            this.emit(message);
          }
        }
        break;

      case "text-end":
        // Mark text streaming as complete
        const endMessage = messageMap.get(event.id);
        if (endMessage) {
          this.emit(endMessage);
        }
        break;

      // tools
      case "tool-start":
        // Create a new message for this tool stream
        const newToolMessage: Message = {
          id: event.id,
          role: "assistant",
          parts: [
            {
              type: "tool",
              toolCallId: event.toolCallId,
              toolName: event.toolName,
              status: "streaming",
              inputStream: "",
            },
          ],
          createdAt: Date.now(),
        };
        messageMap.set(event.id, newToolMessage);
        this.emit(newToolMessage);
        break;

      case "tool-delta":
        // Append text to existing tool message
        const toolMessage = messageMap.get(event.id);
        if (toolMessage) {
          const toolPart = toolMessage.parts.find(
            (p) => p.type === "tool" && p.toolCallId === event.toolCallId
          ) as ToolMessagePart;
          if (toolPart) {
            toolPart.inputStream += event.delta;
            this.emit(toolMessage);
          }
        }
        break;

      case "tool-end":
        // nothing yet
        break;

      // input available
      case "tool-call":
        // Create a new message for this tool call
        const newToolCallMessage: Message = {
          id: event.id,
          role: "assistant",
          parts: [
            {
              type: "tool",
              toolCallId: event.toolCallId,
              toolName: event.toolName,
              status: "pending",
              input: event.input,
            },
          ],
          createdAt: Date.now(),
        };
        messageMap.set(event.id, newToolCallMessage);
        this.emit(newToolCallMessage);
        break;

      // output available
      case "tool-result":
        // Create a new message for this tool result
        const newToolResultMessage: Message = {
          id: event.id,
          role: "assistant",
          parts: [
            {
              type: "tool",
              toolCallId: event.toolCallId,
              toolName: event.toolName,
              status: "completed",
              output: event.output,
              input: event.input,
            },
          ],
          createdAt: Date.now(),
          metadata: {},
        };
        messageMap.set(event.id, newToolResultMessage);
        this.emit(newToolResultMessage);
        break;

      case "finish-step":
        // Step completion
        // Could update any active messages or emit step completion
        break;

      case "finish":
        // Final completion - mark all messages as no longer streaming
        messageMap.forEach((msg) => {
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

export default GenericStreamingAdapter;
