import { ui } from "@melony/ui-kit/server";

export type OrderResult = {
  success: boolean;
  orderId: string;
  item: string;
  quantity: number;
  total: string;
};

/**
 * Renders the order confirmation card UI
 */
export function renderOrderConfirmation(result: OrderResult) {
  return ui.card(
    {},
    [
      ui.col(
        { align: "center", gap: "sm" },
        [
          ui.text("Order Confirmed!", { size: "lg", weight: "bold", color: "success" }),
          ui.text(`Order ID: ${result.orderId}`),
          ui.text(`${result.quantity}x ${result.item}`),
          ui.text(`Total Paid: $${result.total}`, { weight: "bold" }),
        ]
      )
    ]
  );
}

/**
 * Generates the order confirmation message
 */
export function getOrderConfirmationMessage(result: OrderResult): string {
  return `Great! Your order #${result.orderId} for ${result.quantity}x ${result.item} has been placed. Total: $${result.total}. It will be ready in 20 minutes!`;
}
