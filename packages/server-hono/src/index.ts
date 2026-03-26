import type { Context, Hono } from "hono";

export type MelonyHandler = {
  handle(request: Request): Promise<Response> | Response;
};

export type RequestHandler = (request: Request) => Promise<Response> | Response;

function asRequestHandler(target: MelonyHandler | RequestHandler): RequestHandler {
  if (typeof target === "function") {
    return target;
  }
  return (request: Request) => target.handle(request);
}

export function toHonoHandler(target: MelonyHandler | RequestHandler) {
  const handler = asRequestHandler(target);
  return (context: Context): Promise<Response> | Response => handler(context.req.raw);
}

export function mountMelonyRoute(app: Hono, path: string, target: MelonyHandler | RequestHandler): Hono {
  app.all(path, toHonoHandler(target));
  return app;
}
