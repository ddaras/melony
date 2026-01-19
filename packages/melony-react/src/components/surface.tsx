import React, { ReactNode } from "react";
import { useSurface } from "../hooks/use-surface";
import type { Event } from "melony";

export interface SurfaceProps {
  /**
   * The name of the surface to filter events by.
   * Only events with matching Event.surface will be included.
   */
  name: string;
  /**
   * Render function that receives the filtered and slot-deduplicated events.
   */
  children: (events: Event[]) => ReactNode;
}

/**
 * A reusable component that listens to Melony events for a specific surface.
 * It automatically handles slot-based deduplication (latest event for a slot replaces previous ones).
 */
export function Surface({ name, children }: SurfaceProps) {
  const { events } = useSurface({ name });
  return <>{children(events)}</>;
}
