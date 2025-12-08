import z from "zod";

// Simplified UI Protocol
// We rely on TypeScript interfaces on the server for prop safety instead of
// strict Zod schemas for every component to reduce maintenance burden.

export type UINode = {
  type: string;
  props?: Record<string, any>;
  children?: UINode[];
};

export const UINodeSchema: z.ZodType<UINode> = z.lazy(() =>
  z.object({
    type: z.string(),
    props: z.record(z.string(), z.any()).optional(),
    children: z.array(UINodeSchema).optional(),
  })
);

// Root must be a Card (or similar container) and follow the protocol
export const UIRootSchema = z.object({
  type: z.literal("card"), // User requested Card as required root (or we can enforce it in logic)
  props: z.record(z.string(), z.any()).optional(),
  children: z.array(UINodeSchema).optional(),
});

export type UIRoot = z.infer<typeof UIRootSchema>;
