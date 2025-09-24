import { useMelony } from "./melony-provider";
import { MelonyPart, MelonyMessage } from "./types";

export type TextDeltaConfig = {
  /** The type field value that identifies text delta parts (default: "text-delta") */
  deltaType?: string;
  /** The field name that contains the block ID for grouping deltas (default: "id") */
  idField?: string;
  /** The field name that contains the delta text content (default: "delta") */
  deltaField?: string;
  /** The type to convert joined deltas to (default: "text") */
  outputType?: string;
  /** The field name to store the joined text in the output (default: "text") */
  outputField?: string;
};

export type MelonyMessagesOptions<TPart extends MelonyPart = MelonyPart> = {
  filter?: (part: TPart) => boolean;
  groupBy?: (part: TPart) => string;
  sortBy?: (a: TPart, b: TPart) => number;
  limit?: number;
  joinTextDeltas?: boolean | TextDeltaConfig;
};

// Helper function to build text by block ID from delta parts
const buildTextByBlockId = (
  parts: any[], 
  config: Required<TextDeltaConfig>
): Map<string, string> => {
  const map = new Map<string, string>();
  for (const part of parts) {
    if (part.type === config.deltaType) {
      const id = (part as any)[config.idField] as string;
      const delta = ((part as any)[config.deltaField] as string) || "";
      map.set(id, (map.get(id) ?? "") + delta);
    }
  }
  return map;
};

// Helper function to join delta parts into text parts
const joinDeltaParts = <TPart extends MelonyPart = MelonyPart>(
  parts: TPart[],
  config: Required<TextDeltaConfig>
): TPart[] => {
  const textById = buildTextByBlockId(parts, config);
  const renderedTextIds = new Set<string>();
  const result: TPart[] = [];

  for (const part of parts) {
    if (part.type === config.deltaType) {
      const textBlockId = (part as any)[config.idField] as string;
      if (renderedTextIds.has(textBlockId)) {
        // Skip this delta as we've already processed this text block
        continue;
      }
      renderedTextIds.add(textBlockId);
      
      // Convert delta to output part with joined content
      const joinedText = textById.get(textBlockId) ?? "";
      const outputPart = {
        ...part,
        type: config.outputType,
        [config.outputField]: joinedText,
      } as TPart;
      
      result.push(outputPart);
    } else {
      // Keep non-delta parts as-is
      result.push(part);
    }
  }

  return result;
};

export const useMelonyMessages = <TPart extends MelonyPart = MelonyPart>(
  options?: MelonyMessagesOptions<TPart>
): MelonyMessage<TPart>[] => {
  const { parts } = useMelony<TPart>();

  const { filter, groupBy, sortBy, limit, joinTextDeltas } = options || {};

  // Apply filtering first
  let filteredParts = parts;
  if (filter) {
    filteredParts = parts.filter(filter);
  }

  // Apply text delta joining if requested
  if (joinTextDeltas) {
    const config: Required<TextDeltaConfig> = {
      deltaType: "text-delta",
      idField: "id",
      deltaField: "delta",
      outputType: "text",
      outputField: "text",
      ...(typeof joinTextDeltas === "object" ? joinTextDeltas : {}),
    };
    filteredParts = joinDeltaParts(filteredParts, config);
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
    role: (parts[0]?.role ?? "assistant"),
    createdAt: Date.now(),
    metadata: {},
    parts,
  }));
};
