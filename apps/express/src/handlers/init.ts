import { InitEvent } from "../types.js";
import { layoutUI } from "../ui/layout.js";

/**
 * Initial application layout handler
 */
export async function* initHandler(event: InitEvent) {
  yield {
    type: "ui",
    data: layoutUI
  } as any;
}
