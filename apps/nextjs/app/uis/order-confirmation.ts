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
  return {
    type: "card",
    children: [
      {
        type: "col",
        align: "center",
        gap: "sm",
        children: [
          {
            type: "text",
            value: "Order Confirmed!",
            size: "lg",
            weight: "bold",
            color: "success",
          },
          { type: "text", value: `Order ID: ${result.orderId}` },
          { type: "text", value: `${result.quantity}x ${result.item}` },
          { type: "text", value: `Total Paid: $${result.total}`, weight: "bold" },
        ],
      },
    ],
  };
}

/**
 * Generates the order confirmation message
 */
export function getOrderConfirmationMessage(result: OrderResult): string {
  return `Great! Your order #${result.orderId} for ${result.quantity}x ${result.item} has been placed. Total: $${result.total}. It will be ready in 20 minutes!`;
}
