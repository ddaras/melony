import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import type { Context } from "hono";
import { handle } from "melony/adapters/hono";
import { rootAgent } from "./agent";

const app = new Hono();

app.use("*", cors());

app.get("/", (c: Context) => {
  return c.json({ message: "Hello from Melony server!" });
});

app.get("/health", (c: Context) => {
  return c.json({ status: "ok" });
});

app.post("/api/chat", handle(rootAgent));

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Melony server is running on port ${port}`);
console.log(`📡 API endpoint: http://localhost:${port}/api/chat`);

serve({
  fetch: app.fetch,
  port,
});

