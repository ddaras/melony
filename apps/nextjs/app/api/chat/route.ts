import { foodAgent } from "../../agents/food-agent";

export async function POST(req: Request) {
  const body = await req.json();
  const event = body.event;

  if (!event) {
    return new Response(JSON.stringify({ error: "Invalid request: event required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return foodAgent.streamResponse(event);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform") || "web";

  const event = {
    type: "init",
    data: { platform }
  } as any;

  const runtime = foodAgent.build();
  let uiData = null;

  for await (const e of runtime.run(event)) {
    if (e.type === "ui") {
      uiData = e.data;
    }
  }

  return new Response(JSON.stringify(uiData), {
    headers: { "Content-Type": "application/json" },
  });
}
