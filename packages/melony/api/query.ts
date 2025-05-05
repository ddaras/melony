import { QueryConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const query = (config: Omit<QueryConfig, "type">) => {
  return renderUI({
    type: "query",
    ...config,
  });
};
