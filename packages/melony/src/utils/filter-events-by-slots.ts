import { Event } from "../types";

/**
 * Filters a list of events by their slot property.
 * If multiple events have the same slot, only the latest one is kept,
 * but its position in the returned array corresponds to the first time that slot appeared.
 */
export function filterEventsBySlots(events: Event[]): Event[] {
  const firstSlotIndexes = new Map<string, number>();
  const latestSlotIndexes = new Map<string, number>();

  events.forEach((event, index) => {
    if (event.slot) {
      if (!firstSlotIndexes.has(event.slot)) {
        firstSlotIndexes.set(event.slot, index);
      }
      latestSlotIndexes.set(event.slot, index);
    }
  });

  const result: Event[] = [];

  events.forEach((event, index) => {
    if (event.slot) {
      if (firstSlotIndexes.get(event.slot) === index) {
        const latestIndex = latestSlotIndexes.get(event.slot)!;
        result.push(events[latestIndex]);
      }
    } else {
      result.push(event);
    }
  });

  return result;
}
