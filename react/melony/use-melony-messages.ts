import { useMelony } from "./melony-provider";
import { MelonyPart, MelonyMessage, MelonyMessagesOptions } from "./types";

export const useMelonyMessages = (
  options?: MelonyMessagesOptions | ((part: MelonyPart) => string)
): MelonyMessage[] => {
  const { parts } = useMelony();

  // Handle backward compatibility - if options is a function, treat it as groupBy
  const config: MelonyMessagesOptions = typeof options === 'function' 
    ? { groupBy: options }
    : options || {};

  const { filter, groupBy, sortBy, limit } = config;

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

  // If no grouping, return each part as a separate message
  if (!groupBy) {
    return filteredParts.map((part) => ({
      id: crypto.randomUUID(),
      role: part.role,
      parts: [part],
      createdAt: Date.now(),
      metadata: {},
    }));
  }

  // Group parts by the provided function
  const grouped: Record<string, MelonyPart[]> = {};

  filteredParts.forEach((part) => {
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
