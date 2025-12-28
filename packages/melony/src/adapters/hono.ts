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
      });
    }

    const headers = c.req.header();
    const body = await c.req.json();
    const event = body.event as Event;

    if (!event) {
      return c.json({ error: "Invalid request: event required" }, 400);
    }

    return createStreamResponse(
      instance.run({
        event,
        runId: body.runId,
        state: {
          ...body.state,
          requestHeaders: headers,
        },
      })
    );
  };
};
