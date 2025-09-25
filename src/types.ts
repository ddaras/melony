export type Role = "user" | "assistant" | "system";

export type MelonyPart<
  TType extends string = string,
  TExtra extends object | undefined = { text?: string }
> = {
  melonyId: string;
  type: TType;
  role: Role;
} & (TExtra extends undefined ? {} : TExtra);

export type MelonyMessage<TPart extends MelonyPart = MelonyPart> = {
  id: string;
  role: Role;
  parts: TPart[];
  createdAt: number;
  metadata?: Record<string, any>;
};
