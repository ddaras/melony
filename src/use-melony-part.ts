import { useEffect } from "react";
import { useMelony } from "./melony-provider";
import type { MelonyPart } from "./types";

export const useMelonyPart = <TPart extends MelonyPart = MelonyPart>(
  callback: (part: TPart) => void
) => {
  const { subscribeEvents } = useMelony<TPart>();

  useEffect(() => {
    const unsubscribe = subscribeEvents(callback);
    return unsubscribe;
  }, [callback, subscribeEvents]);
};
