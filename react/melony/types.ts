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
