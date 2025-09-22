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
};
