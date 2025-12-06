import { MelonyEvent } from "@melony/core";

/**
 * Chat message format used for transport
 *
 * Key concepts:
 * - Events are the fundamental unit (MelonyEvent)
 * - Messages group events by runId (from backend, always assistant role)
 * - Client can send messages (user/system role) with events inside
 */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  /**
   * Content is always an array of events for consistency
   * - For assistant messages (from backend): array of events grouped by runId
   * - For user/system messages (from client): array of events
   */
  content: MelonyEvent[]; // Always events array
  runId?: string; // Only present for assistant messages (grouped events from backend)
}

/**
 * Transport request payload - sends only the new message with optional threadId
 * Backend can fetch full conversation history using threadId if needed
 */
export interface TransportRequest {
  message: ChatMessage;
  threadId?: string;
}

/**
 * Transport function that takes a single message with optional threadId and returns a stream of events
 * Backend can fetch full conversation history using threadId if needed
 */
export type TransportFn = (
  request: TransportRequest,
  signal?: AbortSignal
) => Promise<ReadableStream<Uint8Array>>;

/**
 * Create an HTTP transport function that sends a single message with threadId
 */
export function createHttpTransport(api: string): TransportFn {
  return async (request: TransportRequest, signal?: AbortSignal) => {
    // Send only the new message with threadId - backend can fetch history if needed
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: request.message,
        threadId: request.threadId,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    return response.body;
  };
}
