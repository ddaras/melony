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
  return c.json({ message: "Hello from Hono server!" });
});

app.get("/health", (c: Context) => {
  return c.json({ status: "ok" });
});

app.post("/api/v1/chat", handle(rootAgent));

const port = Number(process.env.PORT) || 3000;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
