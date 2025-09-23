import { useMelony } from "./melony-provider";
import { MelonyPart, MelonyMessage } from "./types";

export type MelonyMessagesOptions = {
  filter?: (part: MelonyPart) => boolean;
  groupBy?: (part: MelonyPart) => string;
  sortBy?: (a: MelonyPart, b: MelonyPart) => number;
  limit?: number;
};

export const useMelonyMessages = (
  options?: MelonyMessagesOptions
): MelonyMessage[] => {
  const { parts } = useMelony();

  const { filter, groupBy, sortBy, limit } = options || {};

  // Apply filtering first
  let filteredParts = parts;
  if (filter) {
    filteredParts = parts.filter(filter);
  }

  // Apply sorting if provided
  if (sortBy) {
    filteredParts = [...filteredParts].sort(sortBy);
  }

  // Apply limit if provided
  if (limit && limit > 0) {
    filteredParts = filteredParts.slice(0, limit);
  }

  // Group parts by the provided function
  const grouped: Record<string, MelonyPart[]> = {};

  filteredParts.forEach((part) => {
    const key = groupBy?.(part) || part.melonyId;
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
