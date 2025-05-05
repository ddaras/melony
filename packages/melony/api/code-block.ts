import { CodeBlockConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function codeBlock(config?: Omit<CodeBlockConfig, "type">) {
  return renderUI({
    type: "code-block",
    code: config?.code || "<code />",
    ...config,
  });
}
