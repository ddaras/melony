import { Event, Message, Role } from "melony";

export interface AggregatedMessage {
  role: Role;
  content: string;
  runId?: string;
  threadId?: string;
  uiEvents: Event[];
}

export function convertEventsToAggregatedMessages<TEvent extends Event = Event>(
  events: TEvent[],
): AggregatedMessage[] {
  if (events.length === 0) return [];

  const messages: AggregatedMessage[] = [];
  let currentMessage: AggregatedMessage | null = null;

  for (const event of events) {
    const role = event.meta?.role || "assistant";
    const runId = event.meta?.runId;

    // Start a new message if:
    // 1. No current message
    // 2. Role changed
    // 3. runId changed (and both have runIds)
    if (
      !currentMessage ||
      currentMessage.role !== role ||
      (runId && currentMessage.runId && runId !== currentMessage.runId)
    ) {
      currentMessage = {
        role: role,
        content: "",
        runId,
        uiEvents: [],
      };
      messages.push(currentMessage);
    }

    // Handle different event types
    if (event.type === "text-delta" && event.data?.delta) {
      currentMessage.content += event.data.delta;
    } else if (event.type === "text") {
      currentMessage.content += event.data?.content || event.data?.text || "";
    } else {
      // Store UI events separately for rendering
      currentMessage.uiEvents.push(event);
    }

    // If the current message didn't have a runId but this event does, update it
    if (!currentMessage.runId && runId) {
      currentMessage.runId = runId;
    }
  }

  return messages;
}