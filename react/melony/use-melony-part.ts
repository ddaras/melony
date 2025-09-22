import { useEffect } from "react";
import { useMelony } from "./melony-provider";
import type { MelonyPart } from "./types";

export const useMelonyPart = (
  partType?: string,
  filter?: (part: MelonyPart) => boolean,
  callback?: (part: MelonyPart) => void
) => {
  const { subscribePart } = useMelony();

  useEffect(() => {
    const unsubscribe = subscribePart(partType, filter, callback);
    return unsubscribe;
  }, [partType, filter, callback, subscribePart]);
};
