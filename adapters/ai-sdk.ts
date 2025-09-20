import { BaseMessage, StreamingEvent } from "../core/types";
import { MessageAssembler } from "../core/message-assembler";

export interface AIStreamChunk {
  type: string;
  text?: string;
  toolCallId?: string;
  toolName?: string;
  input?: any;
  args?: any;
  output?: any;
  result?: any;
}

/**
 * Converts an AI SDK stream result into a Melony-compatible ReadableStream
 * @param fullStream - The AI SDK fullStream async iterator
 * @returns A ReadableStream that emits Server-Sent Events compatible with Melony
 */
export function createMelonyStreamFromAISDK(
  fullStream: AsyncIterable<AIStreamChunk>,
  options?: {
    onFinish?: ({ message }: { message: BaseMessage }) => void;
  }
): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const id = crypto.randomUUID();
      const messageAssembler = new MessageAssembler();
      const events: StreamingEvent[] = [];

      try {
        for await (const chunk of fullStream) {
          // Transform chunk to Melony compatible StreamingEvent
          const melonyEvent = convertToMelonyEvent(chunk, id);
          events.push(melonyEvent);

          // Process event in assembler to build final message
          messageAssembler.processEvent(melonyEvent);

          const payload = JSON.stringify(melonyEvent);
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        }

        // Signal completion
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));

        // Use the assembled message from all events
        const finalMessage = messageAssembler.getFinalMessage(id);
        if (finalMessage && options?.onFinish) {
          options.onFinish({ message: finalMessage });
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });
}

/**
 * Converts an AI SDK chunk to a Melony StreamingEvent
 * @param chunk - The AI SDK stream chunk
 * @param id - Unique identifier for the stream
 * @returns A Melony StreamingEvent
 */
function convertToMelonyEvent(
  chunk: AIStreamChunk,
  id: string
): StreamingEvent {
  switch (chunk.type) {
    case "start":
      return { type: "start", id };

    case "start-step":
      return { type: "start-step", id };

    case "text-start":
      return {
        type: "text-start",
        id,
      };

    case "text-delta":
      return {
        type: "text-delta",
        id,
        delta: chunk.text || "",
      };

    case "text-end":
      return {
        type: "text-end",
        id,
      };

    case "tool-call":
      return {
        type: "tool-call",
        id,
        toolCallId: chunk.toolCallId || "default",
        toolName: chunk.toolName || "unknown",
        input: chunk.input || chunk.args || {},
      };

    case "tool-result":
      return {
        type: "tool-result",
        id,
        toolCallId: chunk.toolCallId || "default",
        toolName: chunk.toolName || "unknown",
        input: chunk.input || chunk.args || {},
        output: chunk.output || chunk.result || null,
      };

    case "finish-step":
      return { type: "finish-step", id };

    case "finish":
      return { type: "finish", id };

    default:
      return { type: "start", id };
  }
}
