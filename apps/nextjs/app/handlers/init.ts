import { InitEvent } from "../agents/types";
import { UINode } from "@melony/ui-kit";

/**
 * Initial application layout handler
 */
export async function* initAppHandler(event: InitEvent) {
  console.log(`[InitHandler] Initializing app for platform: ${event.data.platform}`);

  const layout: UINode = {
    type: "thread",
    props: {
      placeholder: "I'm hungry...",
    },
  };

  yield {
    type: "ui",
    data: layout
  } as any;
}
