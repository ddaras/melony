import { createServer, IncomingHttpHeaders, Server } from "node:http";

export type MelonyHandler = {
  handle(request: Request): Promise<Response> | Response;
};

export type RequestHandler = (request: Request) => Promise<Response> | Response;

export type NodeCorsOrigin =
  | "*"
  | string
  | RegExp
  | Array<string | RegExp>
  | ((origin: string | null) => boolean);

export type NodeCorsOptions = {
  origin?: NodeCorsOrigin;
  credentials?: boolean;
  methods?: string[];
  allowedHeaders?: string[];
};

export type NodeServeOptions = {
  port?: number | string;
  hostname?: string;
  onListen?: (url: string) => void;
  cors?: NodeCorsOptions;
  path?: string;
};

function asRequestHandler(target: MelonyHandler | RequestHandler): RequestHandler {
  if (typeof target === "function") {
    return target;
  }
  return (request: Request) => target.handle(request);
}

function toHeadersInit(headers: IncomingHttpHeaders): HeadersInit {
  const entries: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const item of value) entries.push([key, item]);
    } else if (typeof value === "string") {
      entries.push([key, value]);
    }
  }
  return entries;
}

function resolveCorsOrigin(
  origin: string | null,
  configuredOrigin: NodeCorsOrigin
): string | null {
  if (configuredOrigin === "*") {
    // Reflect request origin when present to stay compatible with credentialed requests,
    // while still semantically allowing all origins by default.
    return origin ?? "*";
  }

  if (typeof configuredOrigin === "function") {
    return configuredOrigin(origin) ? origin : null;
  }

  if (!origin) return null;

  if (typeof configuredOrigin === "string") {
    return configuredOrigin === origin ? origin : null;
  }

  if (configuredOrigin instanceof RegExp) {
    return configuredOrigin.test(origin) ? origin : null;
  }

  for (const candidate of configuredOrigin) {
    if (typeof candidate === "string" && candidate === origin) return origin;
    if (candidate instanceof RegExp && candidate.test(origin)) return origin;
  }

  return null;
}

function applyCorsHeaders(
  headers: Headers,
  origin: string | null,
  options: NodeCorsOptions,
  requestedHeaders?: string | null
): void {
  const allowedOrigin = resolveCorsOrigin(origin, options.origin ?? "*");
  if (!allowedOrigin) return;

  headers.set("Access-Control-Allow-Origin", allowedOrigin);

  // Browsers reject wildcard origin when credentials are enabled.
  const allowCredentials = options.credentials ?? (allowedOrigin !== "*");
  if (allowCredentials) {
    headers.set("Access-Control-Allow-Credentials", "true");
  }

  headers.set("Access-Control-Allow-Methods", (options.methods ?? ["GET", "POST", "OPTIONS"]).join(","));
  headers.set("Access-Control-Allow-Headers", requestedHeaders ?? (options.allowedHeaders ?? [
    "Content-Type",
    "Authorization",
    "x-melony-thread-id",
    "x-melony-run-id",
  ]).join(", "));

  if (allowedOrigin !== "*") {
    headers.set("Vary", "Origin");
  }
}

function normalizePath(path: string): string {
  if (!path.startsWith("/")) return `/${path}`;
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function serveNode(
  target: MelonyHandler | RequestHandler,
  options: NodeServeOptions = {}
): Server {
  const handler = asRequestHandler(target);
  const corsOptions = options.cors ?? {};
  const port = Number(options.port ?? process.env.PORT ?? 7123);
  const hostname = options.hostname ?? "0.0.0.0";
  const routePath = normalizePath(options.path ?? "/");

  const server = createServer(async (req, res) => {
    const url = `http://${req.headers.host ?? `localhost:${port}`}${req.url ?? "/"}`;
    const pathname = normalizePath(new URL(url).pathname);
    const origin = typeof req.headers.origin === "string" ? req.headers.origin : null;
    const requestedHeaders =
      typeof req.headers["access-control-request-headers"] === "string"
        ? req.headers["access-control-request-headers"]
        : null;
    if (pathname !== routePath) {
      const headers = new Headers();
      applyCorsHeaders(headers, origin, corsOptions, requestedHeaders);
      headers.set("Content-Type", "application/json");
      res.writeHead(404, Object.fromEntries(headers.entries()));
      res.end(JSON.stringify({ error: "Not Found" }));
      return;
    }

    if ((req.method ?? "GET") === "OPTIONS") {
      const preflightHeaders = new Headers();
      applyCorsHeaders(preflightHeaders, origin, corsOptions, requestedHeaders);
      res.writeHead(204, Object.fromEntries(preflightHeaders.entries()));
      res.end();
      return;
    }
    const method = req.method ?? "GET";

    let body: string | undefined;
    if (method !== "GET" && method !== "HEAD") {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      body = chunks.length > 0 ? Buffer.concat(chunks).toString() : undefined;
    }

    const request = new Request(url, {
      method,
      headers: toHeadersInit(req.headers),
      body,
    });

    const response = await handler(request);
    applyCorsHeaders(response.headers, origin, corsOptions, requestedHeaders);
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  });

  server.listen(port, hostname, () => {
    const url = `http://${hostname}:${port}`;
    if (options.onListen) {
      options.onListen(url);
      return;
    }
    console.log(`Melony server running at ${url}`);
  });

  return server;
}
