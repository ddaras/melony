import { useEffect } from "react";
import { useMelony } from "./melony-provider";
import type { MelonyPart } from "./types";

export const useMelonyPart = (callback: (part: MelonyPart) => void) => {
  const { subscribeEvents } = useMelony();

  useEffect(() => {
    const unsubscribe = subscribeEvents(callback);
    return unsubscribe;
  }, [callback, subscribeEvents]);
};
