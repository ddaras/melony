import { Event, createStreamResponse } from "melony";
import { rootAgent } from "@/app/agent";
import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({
    starterPrompts: rootAgent.config.starterPrompts || [],
    options: rootAgent.config.options || [],
    fileAttachments: rootAgent.config.fileAttachments,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body.event as Event;

    if (!event) {
      return Response.json(
        { error: "Invalid request: event required" },
        { status: 400 },
      );
    }

    return createStreamResponse(rootAgent.run(event));
  } catch (error) {
    console.error("Error in chat route:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
