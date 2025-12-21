import { useContext, useEffect } from "react";
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

  useEffect(() => {
    if (
      initialEvents &&
      initialEvents.length > 0 &&
      client.getState().events.length === 0
    ) {
      reset(initialEvents);
    }
  }, [client, initialEvents, reset]);

  return context;
};
