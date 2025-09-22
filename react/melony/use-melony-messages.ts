import { useMelony } from "./melony-provider";
import { MelonyPart, MelonyMessage } from "./types";

export const useMelonyMessages = (
  groupBy?: (part: MelonyPart) => string
): MelonyMessage[] => {
  const { parts } = useMelony();

  if (!groupBy)
    return parts.map((part) => ({
      id: crypto.randomUUID(),
      role: part.role,
      parts: [part],
      createdAt: Date.now(),
      metadata: {},
    }));

  // Flatten all parts and regroup
  const grouped: Record<string, MelonyPart[]> = {};

  parts.forEach((part) => {
    const key = groupBy(part);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(part);
  });

  return Object.entries(grouped).map(([key, parts]) => ({
    id: key,
    role: parts[0]?.role || "unknown",
    createdAt: Date.now(),
    metadata: {},
    parts,
  }));
};
