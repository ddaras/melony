import { useContext, useEffect, useRef } from "react";
import { MelonyContext, MelonyContextValue } from "@/providers/melony-provider";
import { Event } from "melony";

export interface UseMelonyOptions {
  initialEvents?: Event[];
}

export const useMelony = (options?: UseMelonyOptions): MelonyContextValue => {
  const context = useContext(MelonyContext);
  if (context === undefined) {
    throw new Error("useMelony must be used within a MelonyClientProvider");
  }

  const { client, reset } = context;
  const { initialEvents } = options || {};
  const prevInitialEventsRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // If the provided initialEvents is the EXACT SAME array reference as the client's current events,
    // it means we are already in sync (likely because we are in a 'new thread' state
    // where ThreadProvider uses client.events as initialData).
    if (initialEvents && initialEvents === client.getState().events) {
      return;
    }

    // Serialize current initialEvents for comparison
    const currentSerialized = initialEvents
      ? JSON.stringify(initialEvents)
      : undefined;

    // Reset when initialEvents changes (e.g., when switching threads)
    if (currentSerialized !== prevInitialEventsRef.current) {
      if (initialEvents) {
        reset(initialEvents);
      } else {
        reset([]);
      }
      prevInitialEventsRef.current = currentSerialized;
    }
  }, [client, initialEvents, reset]);

  return context;
};
