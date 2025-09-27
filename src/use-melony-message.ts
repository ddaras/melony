import { MelonyMessage, MelonyPart } from "./types";

export const useMelonyMessage = <TPart extends MelonyPart = MelonyPart>(
  message: MelonyMessage<TPart>,
  {
    filter,
    groupBy,
    sortBy,
    limit,
  }: {
    filter?: (part: TPart) => boolean;
    groupBy?: (part: TPart) => string;
    sortBy?: (a: TPart, b: TPart) => number;
    limit?: number;
  }
) => {
  let parts = message.parts;

  if (filter) {
    parts = parts.filter(filter);
  }
  if (sortBy) {
    parts = parts.sort(sortBy);
  }
  if (limit) {
    parts = parts.slice(0, limit);
  }

  const groupedParts = parts.reduce((acc, part) => {
    const key = groupBy?.(part) || part.melonyId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(part);
    return acc;
  }, {} as Record<string, TPart[]>);

  return {
    ...message,
    parts: groupedParts,
  };
};
