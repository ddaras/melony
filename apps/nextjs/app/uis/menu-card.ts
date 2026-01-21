import { ui } from "melony";
import type { MenuItem } from "../agents/food-agent";

/**
 * Renders the menu card UI with order buttons
 */
export function renderMenuCard(menuItems: MenuItem[]) {
  return ui.card({
    children: [
      ui.col({
        gap: "md",
        children: menuItems.map((item) =>
          ui.row({
            justify: "between",
            align: "center",
            children: [
              ui.col({
                children: [
                  ui.text(item.name, { weight: "bold" }),
                  ui.text(item.description, { size: "sm", color: "muted" }),
                  ui.text(`$${item.price.toFixed(2)}`, { size: "sm" }),
                ],
              }),
              ui.button({
                label: "Order",
                onClickAction: {
                  type: "order-food",
                  data: { itemId: item.id },
                  nextAction: {
                    action: "placeOrder",
                    params: { itemId: item.id, quantity: 1 },
                  },
                },
              }),
            ],
          })
        ),
      }),
    ],
  });
}
