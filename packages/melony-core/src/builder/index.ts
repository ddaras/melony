// Export widget definition functions
export {
  defineWidget,
  zodSchemaToPrompt,
  compileWidgets,
  generateWidgetSystemPrompt,
} from "./define-widget";

export type { PromptConfig } from "./define-widget";

// Export prompt functions
export { createWidgetPrompt } from "./prompts";
