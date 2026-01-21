import { UINode } from "@/ui-contract";
import type { MenuItem } from "../data/menu";

/**
 * Renders the menu card UI with order buttons
 */
export function renderMenuCard(menuItems: MenuItem[]): UINode {
  return {
    type: "card",
    children: [
      {
        type: "col",
        props: {
          gap: "md",
        },
        children: menuItems.map((item) => ({
          type: "row",
          props: {
            justify: "between",
          },
          children: [
            {
              type: "col",
              children: [
                { type: "text", props: { value: item.name, weight: "bold" } },
                { type: "text", props: { value: item.description, size: "sm", color: "muted" } },
                { type: "text", props: { value: `$${item.price.toFixed(2)}`, size: "sm" } },
              ],
            },
            {
              type: "button",
              props: {
                label: "Order",
                onClickAction: {
                  type: "order-food",
                  data: { itemId: item.id },
                  nextAction: {
                    action: "placeOrder",
                    params: { itemId: item.id, quantity: 1 },
                  },
                },
              },
            },
          ],
        })),
      },
    ],
  };
}
