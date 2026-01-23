import { ui, UINode } from "@melony/ui-kit/server";
import type { MenuItem } from "../data/menu";

/**
 * Renders the menu card UI with order buttons
 */
export function renderMenuCard(menuItems: MenuItem[]): UINode {
  return ui.card(
    {},
    [
      ui.col(
        { gap: "md" },
        menuItems.map((item) =>
          ui.row(
            { justify: "between" },
            [
              ui.col(
                {},
                [
                  ui.text(item.name, { weight: "bold" }),
                  ui.text(item.description, { size: "sm", color: "muted" }),
                  ui.text(`$${item.price.toFixed(2)}`, { size: "sm" }),
                ]
              ),
              ui.button({
                label: "Order",
                onClickAction: {
                  type: "order-food",
                  data: { itemId: item.id },
                  nextAction: {
                    action: "placeOrder",
                    params: { itemId: item.id, quantity: 1 },
                  },
                } as any,
              }),
            ]
          )
        )
      )
    ]
  );
}
