import z from "zod";
import { Action } from "@melony/core";

export const defineAction = <TParams extends z.ZodSchema>(
  action: Action<TParams>
): Action<TParams> => {
  return action;
};
