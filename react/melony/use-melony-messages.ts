import { useMelony } from "./melony-provider";
import { MelonyPart, MelonyMessage, MelonyMessagesOptions } from "./types";

/**
 * Generic function to join parts based on user-defined criteria
 */
function joinPartsLogic(
  parts: MelonyPart[],
  joinConfig: NonNullable<MelonyMessagesOptions['joinParts']>
): MelonyPart[] {
  const { shouldJoin, merge, sortBeforeJoin } = joinConfig;
  
  // Sort parts before joining if sortBeforeJoin is provided
  let sortedParts = sortBeforeJoin ? [...parts].sort(sortBeforeJoin) : parts;
  
  if (sortedParts.length === 0) return sortedParts;
  
  const result: MelonyPart[] = [];
  let currentGroup: MelonyPart[] = [sortedParts[0]];
  
  for (let i = 1; i < sortedParts.length; i++) {
    const currentPart = sortedParts[i];
    const lastPartInGroup = currentGroup[currentGroup.length - 1];
    
    if (shouldJoin(lastPartInGroup, currentPart)) {
      // Add to current group
      currentGroup.push(currentPart);
    } else {
      // Finalize current group and start new one
      if (currentGroup.length === 1) {
        result.push(currentGroup[0]);
      } else {
        // Merge all parts in the group
        const mergedPart = currentGroup.reduce((acc, part) => merge(acc, part));
        result.push(mergedPart);
      }
      currentGroup = [currentPart];
    }
  }
  
  // Handle the last group
  if (currentGroup.length === 1) {
    result.push(currentGroup[0]);
  } else {
    const mergedPart = currentGroup.reduce((acc, part) => merge(acc, part));
    result.push(mergedPart);
  }
  
  return result;
}

export const useMelonyMessages = (
  options?: MelonyMessagesOptions | ((part: MelonyPart) => string)
): MelonyMessage[] => {
  const { parts } = useMelony();

  // Handle backward compatibility - if options is a function, treat it as groupBy
  const config: MelonyMessagesOptions = typeof options === 'function' 
    ? { groupBy: options }
    : options || {};

  const { filter, groupBy, sortBy, limit, joinParts } = config;

  // Apply filtering first
  let filteredParts = parts;
  if (filter) {
    filteredParts = parts.filter(filter);
  }

  // Apply sorting if provided
  if (sortBy) {
    filteredParts = [...filteredParts].sort(sortBy);
  }

  // Apply part joining if configured
  if (joinParts) {
    filteredParts = joinPartsLogic(filteredParts, joinParts);
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
