import { MENU } from "../data/menu";

type PlaceOrderParams = {
  itemId: string;
  quantity: number;
};

export const placeOrderAction = async function* ({ itemId, quantity }: PlaceOrderParams) {
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
};
