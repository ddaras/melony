import { Event } from "../types";

/**
 * Convert an async generator of events to an HTTP streaming response
 * Exported for backward compatibility and standalone usage
 */
export function createStreamResponse(
  generator: AsyncGenerator<Event>
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const message of generator) {
          // Format as SSE: data: {...}\n\n
          const chunk = `data: ${JSON.stringify(message)}\n\n`;
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
