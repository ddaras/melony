import { Event } from "../types";
import { createStreamResponse } from "../utils/create-stream-response";

/**
 * Event-centric Hono adapter for Melony.
 */
export const handle = (instance: { run: any; config: any }) => {
  return async (c: any) => {
    if (c.req.method === "GET") {
      return c.json({
        starterPrompts: instance.config.starterPrompts || [],
        options: instance.config.options || [],
        fileAttachments: instance.config.fileAttachments,
      });
    }

    const headers = c.req.header();
    const body = await c.req.json();
    const event = body.event as Event;

    if (!event) {
      return c.json({ error: "Invalid request: event required" }, 400);
    }

    // Merge headers into event state
    if (!event.meta) {
      event.meta = {} as any;
    }
    event.meta!.state = {
      ...(event.meta?.state || {}),
      requestHeaders: headers,
    };

    return createStreamResponse(instance.run(event));
  };
};
