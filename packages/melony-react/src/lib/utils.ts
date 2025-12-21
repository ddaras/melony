import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Event } from "melony";
import { Message } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupEventsToMessages(events: Event[]): Message[] {
  if (events.length === 0) return [];

  const messages: Message[] = [];
  let currentMessage: Message | null = null;

  for (const event of events) {
    const role = event.role || "assistant";
    const runId = event.runId;

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
