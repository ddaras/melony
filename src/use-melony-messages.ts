import { useMelony } from "./melony-provider";
import { MelonyPart, MelonyMessage } from "./types";

export type MergeConfig<TPart extends MelonyPart = MelonyPart> = {
  /** Function to determine which parts should be merged together. Returns a key to group parts by, or null to skip merging. */
  groupBy?: (part: TPart) => string | null;
  /** Function to merge an array of parts into a single part */
  merge: (parts: TPart[]) => TPart;
};

export type MelonyMessagesOptions<TPart extends MelonyPart = MelonyPart> = {
  filter?: (part: TPart) => boolean;
  groupBy?: (part: TPart) => string;
  sortBy?: (a: TPart, b: TPart) => number;
  limit?: number;
  merge?: boolean | MergeConfig<TPart> | MergeConfig<TPart>[];
};

// Helper function to merge parts based on custom configuration
const mergeParts = <TPart extends MelonyPart = MelonyPart>(
  parts: TPart[],
  config: Required<MergeConfig<TPart>>
): TPart[] => {
  const groups = new Map<string, TPart[]>();
  const nonMergeableParts: TPart[] = [];

  // Group parts that should be merged
  for (const part of parts) {
    const groupKey = config.groupBy(part);
    if (groupKey) {
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(part);
    } else {
      nonMergeableParts.push(part);
    }
  }

  // Merge grouped parts and combine with non-mergeable parts
  const result: TPart[] = [...nonMergeableParts];

  for (const [groupKey, groupParts] of groups) {
    if (groupParts.length > 0) {
      const mergedPart = config.merge(groupParts);
      result.push(mergedPart);
    }
  }

  return result;
};

export const useMelonyMessages = <TPart extends MelonyPart = MelonyPart>(
  options?: MelonyMessagesOptions<TPart>
): MelonyMessage<TPart>[] => {
  const { parts } = useMelony<TPart>();

  const { filter, groupBy, sortBy, limit, merge = false } = options || {};

  // Apply filtering first
  let filteredParts = parts;
  if (filter) {
    filteredParts = parts.filter(filter);
  }

  // Apply custom merging if requested
  if (merge) {
    const mergeConfigs: MergeConfig<TPart>[] = Array.isArray(merge)
      ? merge
      : [
          typeof merge === "object"
            ? merge
            : {
                groupBy: (part) => part.melonyId, // Default grouping by melonyId
                merge: (parts) => parts[0], // Default: take first part
              },
        ];

    // Apply each merge configuration sequentially
    for (const mergeConfig of mergeConfigs) {
      const config: Required<MergeConfig<TPart>> = {
        groupBy: mergeConfig.groupBy || ((part) => part.melonyId), // Default grouping by melonyId
        merge: mergeConfig.merge || ((parts) => parts[0]), // Default: take first part
      };
      filteredParts = mergeParts(filteredParts, config);
    }
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
