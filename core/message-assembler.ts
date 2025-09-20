import { BaseMessage, StreamingEvent, ToolMessagePart } from "./types";

/**
 * Utility class for assembling messages from streaming events
 * Can be used both in streaming handlers and in adapters for onFinish callbacks
 */
export class MessageAssembler {
  private messageMap = new Map<string, BaseMessage>();

  /**
   * Process a streaming event and update the internal message map
   * @param event - The streaming event to process
   * @returns The updated message if one was modified, undefined otherwise
   */
  processEvent(event: StreamingEvent): BaseMessage | undefined {
    switch (event.type) {
      case "start":
        return undefined;

      case "start-step":
        // Step start - could indicate thinking or tool use is about to begin
        return undefined;

      case "text-start":
        // Create a new message for this text stream or add text part to existing
        const existingMessage = this.messageMap.get(event.id);
        const newMessage: BaseMessage = {
          id: event.id,
          role: "assistant",
          parts: [
            ...(existingMessage?.parts || []),
            { type: "text", text: "" },
          ],
          createdAt: existingMessage?.createdAt || Date.now(),
          metadata: existingMessage?.metadata || {},
        };
        this.messageMap.set(event.id, newMessage);
        return newMessage;

      case "text-delta":
        // Append text to existing message
        const message = this.messageMap.get(event.id);
        if (message) {
          const textPart = message.parts.find((p) => p.type === "text");
          if (textPart) {
            textPart.text += event.delta;
            return message;
          }
        }
        return undefined;

      case "text-end":
        // Mark text streaming as complete
        const endMessage = this.messageMap.get(event.id);
        return endMessage;

      case "tool-start":
        // Create a new message for this tool stream
        const newToolMessage: BaseMessage = {
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
        this.messageMap.set(event.id, newToolMessage);
        return newToolMessage;

      case "tool-delta":
        // Append text to existing tool message
        const toolMessage = this.messageMap.get(event.id);
        if (toolMessage) {
          const toolPart = toolMessage.parts.find(
            (p) => p.type === "tool" && p.toolCallId === event.toolCallId
          ) as ToolMessagePart;
          if (toolPart) {
            toolPart.inputStream += event.delta;
            return toolMessage;
          }
        }
        return undefined;

      case "tool-end":
        // Tool streaming ended
        return undefined;

      case "tool-call":
        // Create a new message for this tool call
        const newToolCallMessage: BaseMessage = {
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
        this.messageMap.set(event.id, newToolCallMessage);
        return newToolCallMessage;

      case "tool-result":
        // Create a new message for this tool result
        const newToolResultMessage: BaseMessage = {
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
        this.messageMap.set(event.id, newToolResultMessage);
        return newToolResultMessage;

      case "finish-step":
        // Step completion
        return undefined;

      case "finish":
        // Final completion - return all messages
        return undefined;

      default:
        return undefined;
    }
  }

  /**
   * Get a message by ID
   */
  getMessage(id: string): BaseMessage | undefined {
    return this.messageMap.get(id);
  }

  /**
   * Get all messages
   */
  getAllMessages(): BaseMessage[] {
    return Array.from(this.messageMap.values());
  }

  /**
   * Clear all messages
   */
  clear(): void {
    this.messageMap.clear();
  }

  /**
   * Process multiple events and return the final assembled messages
   * Useful for onFinish callbacks where you have all events at once
   */
  static assembleFromEvents(events: StreamingEvent[]): BaseMessage[] {
    const assembler = new MessageAssembler();

    for (const event of events) {
      assembler.processEvent(event);
    }

    return assembler.getAllMessages();
  }

  /**
   * Create a final message from accumulated events
   * This is useful for onFinish callbacks where you want a single final message
   */
  getFinalMessage(id: string): BaseMessage | undefined {
    const message = this.messageMap.get(id);
    if (!message) return undefined;

    // Clean up any streaming states for final message
    const finalParts = message.parts.map((part) => {
      if (part.type === "tool" && part.status === "streaming") {
        return {
          ...part,
          status: "completed" as const,
          input: part.inputStream ? JSON.parse(part.inputStream) : part.input,
        };
      }
      return part;
    });

    return {
      ...message,
      parts: finalParts,
    };
  }
}
