import { InitEvent, ChatState, ChatEvent } from "../types.js";
import { layoutUI } from "../ui/layout.js";
import { RuntimeContext } from "melony";

/**
 * Initial application layout handler
 */
export async function* initHandler(
  event: InitEvent,
  { state }: RuntimeContext<ChatState, ChatEvent>
): AsyncGenerator<ChatEvent, void, unknown> {
  // Initialize path state if not already present
  if (!state.cwd) {
    state.cwd = process.cwd();
  }

  if (!state.workspaceRoot) {
    state.workspaceRoot = process.cwd();
  }

  yield {
    type: "ui",
    meta: {
      type: "layout",
    },
    data: await layoutUI({ tab: event.data?.tab || "chat", sessionId: state.sessionId })
  } as unknown as ChatEvent;
}
