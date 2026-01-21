import { action } from "melony";
import { z } from "zod";
import { MENU } from "../data/menu";

export const placeOrderAction = action({
  name: "placeOrder",
  description: "Place a food order",
  paramsSchema: z.object({
    itemId: z.string().describe("The ID of the item to order"),
    quantity: z.number().default(1).describe("The quantity to order"),
  }),
  execute: async function* ({ itemId, quantity }) {
    const item = MENU.find((m) => m.id === itemId);
    if (!item) throw new Error("Item not found");

    const total = item.price * quantity;
    return {
      success: true,
      orderId: Math.random().toString(36).substring(7).toUpperCase(),
      item: item.name,
      quantity,
      total: total.toFixed(2),
    };
  },
});
