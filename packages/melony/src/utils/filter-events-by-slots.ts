import { Event } from "../types";

/**
 * Filters a list of events by their slot property.
 * If multiple events have the same slot, only the latest one is kept,
 * but its position in the returned array corresponds to the first time that slot appeared.
 */
export function filterEventsBySlots<TEvent extends Event = Event>(
  events: TEvent[],
): TEvent[] {
  const firstSlotIndexes = new Map<string, number>();
  const latestSlotIndexes = new Map<string, number>();

  events.forEach((event, index) => {
    const slot = event.meta?.slot;
    if (slot) {
      if (!firstSlotIndexes.has(slot)) {
        firstSlotIndexes.set(slot, index);
      }
      latestSlotIndexes.set(slot, index);
    }
  });

  const result: TEvent[] = [];

  events.forEach((event, index) => {
    const slot = event.meta?.slot;
    if (slot) {
      if (firstSlotIndexes.get(slot) === index) {
        const latestIndex = latestSlotIndexes.get(slot)!;
        result.push(events[latestIndex]);
      }
    } else {
      result.push(event);
    }
  });

  return result;
}
