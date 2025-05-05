import { MutationConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const mutation = (config: Omit<MutationConfig, "type">) => {
  return renderUI({
    type: "mutation",
    ...config,
  });
};
