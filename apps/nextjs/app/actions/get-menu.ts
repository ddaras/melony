import { action } from "melony";
import { z } from "zod";
import { MENU } from "../data/menu";

export const getMenuAction = action({
  name: "getMenu",
  description: "Get the current food menu",
  paramsSchema: z.object({}),
  execute: async function* () {
    return { menu: MENU };
  },
});
