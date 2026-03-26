export type MelonyHandler = {
  handle(request: Request): Promise<Response> | Response;
};

export type RequestHandler = (request: Request) => Promise<Response> | Response;

export type DenoServeOptions = {
  port?: number;
  hostname?: string;
  onListen?: (url: string) => void;
  path?: string;
};

function asRequestHandler(target: MelonyHandler | RequestHandler): RequestHandler {
  if (typeof target === "function") {
    return target;
  }
  return (request: Request) => target.handle(request);
}

function normalizePath(path: string): string {
  if (!path.startsWith("/")) return `/${path}`;
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function serveDeno(target: MelonyHandler | RequestHandler, options: DenoServeOptions = {}): unknown {
  const deno = (globalThis as any).Deno;
  if (!deno?.serve) {
    throw new Error("Deno runtime not detected. Use this adapter inside Deno.");
  }

  const handler = asRequestHandler(target);
  const port = options.port ?? Number((globalThis as any).process?.env?.PORT ?? 7123);
  const hostname = options.hostname ?? "0.0.0.0";
  const routePath = normalizePath(options.path ?? "/");

  const server = deno.serve({ port, hostname }, (request: Request) => {
    const pathname = normalizePath(new URL(request.url).pathname);
    if (pathname !== routePath) {
      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return handler(request);
  });

  if (options.onListen) {
    options.onListen(`http://${hostname}:${port}`);
  }

  return server;
}
