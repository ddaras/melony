export type Role = "user" | "assistant" | "system";

export type MelonyPart = {
  melonyId: string;
  type: string;
  role: Role;
  text?: string; // this is used for user message
};

export type MelonyMessage = {
  id: string;
  role: Role;
  parts: MelonyPart[];
  createdAt: number;
  metadata?: Record<string, any>;
};

export type MelonyMessagesOptions = {
  filter?: (part: MelonyPart) => boolean;
  groupBy?: (part: MelonyPart) => string;
  sortBy?: (a: MelonyPart, b: MelonyPart) => number;
  limit?: number;
  joinParts?: {
    // Function to determine if parts should be joined together
    shouldJoin: (part1: MelonyPart, part2: MelonyPart) => boolean;
    // Function to merge two parts into one
    merge: (part1: MelonyPart, part2: MelonyPart) => MelonyPart;
    // Optional: function to sort parts before joining (useful for out-of-order streams)
    sortBeforeJoin?: (a: MelonyPart, b: MelonyPart) => number;
  };
};
