import { foodAgent } from "../../agents/food-agent";
import { createStreamResponse } from "melony";

export async function POST(req: Request) {
  const body = await req.json();
  const event = body.event;

  if (!event) {
    return new Response(JSON.stringify({ error: "Invalid request: event required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Merge headers into event state if needed
  if (!event.meta) {
    event.meta = {};
  }

  // We don't really need headers for this demo, but following the pattern
  event.meta.state = {
    ...(event.meta.state || {}),
  };

  return createStreamResponse(foodAgent.run(event));
}

export async function GET() {
  return new Response(JSON.stringify({
    starterPrompts: foodAgent.config.starterPrompts || [],
    options: foodAgent.config.options || [],
  }), {
    headers: { "Content-Type": "application/json" },
  });
}
