import { useMelony } from "./melony-provider";
import { MelonyPart, MelonyMessage } from "./types";

export type MelonyMessagesOptions<TPart extends MelonyPart = MelonyPart> = {
  filter?: (part: TPart) => boolean;
  groupBy?: (part: TPart) => string;
  sortBy?: (a: TPart, b: TPart) => number;
  limit?: number;
};

export const useMelonyMessages = <TPart extends MelonyPart = MelonyPart>(
  options?: MelonyMessagesOptions<TPart>
): MelonyMessage<TPart>[] => {
  const { parts } = useMelony<TPart>();

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
  const grouped: Record<string, TPart[]> = {};

  filteredParts.forEach((part) => {
    const key = groupBy?.(part) || part.melonyId;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(part);
  });

  return Object.entries(grouped).map(([key, parts]) => ({
    id: key,
    role: parts[0]?.role ?? "assistant",
    createdAt: Date.now(),
    metadata: {},
    parts,
  }));
};
