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
