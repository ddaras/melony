import { QueryConfig } from "../builder/types";
import { UseQueryResult } from "@melony/ui";
import { renderUI } from "../render/ui";

export const query = (
  render: (query: UseQueryResult<any, any>) => React.ReactNode,
  config: Omit<QueryConfig, "type" | "render">
) => {
  return renderUI({
    type: "query",
    ...config,
    render,
  });
};
