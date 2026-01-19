import { useMemo } from "react";
import { filterEventsBySlots } from "melony";
import type { Event } from "melony";
import { useMelony } from "./use-melony";

export interface UseSurfaceOptions {
  name: string;
}

export const useSurface = (options: UseSurfaceOptions) => {
  const { events } = useMelony();

  const surfaceEvents = useMemo(() => {
    // 1. Filter by surface name
    const filtered = events.filter((event) => event.surface === options.name);
    // 2. Apply slot logic: replace events with the same slot
    return filterEventsBySlots(filtered);
  }, [events, options.name]);

  return {
    events: surfaceEvents,
  };
};
