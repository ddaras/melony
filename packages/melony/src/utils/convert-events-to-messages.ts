import { Event, Message } from "../types";

export function convertEventsToMessages<TEvent extends Event = Event>(
  events: TEvent[],
): Message<TEvent>[] {
  if (events.length === 0) return [];

  const messages: Message<TEvent>[] = [];
  let currentMessage: Message<TEvent> | null = null;

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
        content: [event],
        runId,
      };
      messages.push(currentMessage);
    } else {
      currentMessage.content.push(event);
      // If the current message didn't have a runId but this event does, update it
      if (!currentMessage.runId && runId) {
        currentMessage.runId = runId;
      }
    }
  }

  return messages;
}
