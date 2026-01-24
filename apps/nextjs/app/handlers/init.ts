import { InitEvent } from "../agents/types";
import { UINode } from "@melony/ui-kit";

/**
 * Initial application layout handler
 */
export async function* initAppHandler(event: InitEvent) {
  console.log(`[InitHandler] Initializing app for platform: ${event.data.platform}`);

  const layout: UINode<"thread"> = {
    type: "thread",
    props: {
      placeholder: "I'm hungry...",
      welcomeTitle: "Hello, Foodie!",
      welcomeMessage: "I'm your Melony assistant. How can I help you satisfy your cravings today?",
      suggestions: [
        "What's on the menu?",
        "Show me some healthy options",
        "How do I place an order?",
        "Do you have any specials today?"
      ]
    },
  };

  yield {
    type: "ui",
    data: layout
  } as any;
}
