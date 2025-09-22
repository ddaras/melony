export type Role = "user" | "assistant" | "system";

export type MelonyPart = { type: string; role: Role; text?: string };

export type MelonyMessage = {
  id: string;
  role: Role;
  parts: MelonyPart[];
  createdAt: number;
  metadata?: Record<string, any>;
};
