import { MutationConfig } from "../builder/types";
import { renderUI } from "../render/ui";
import { UseMutationResult } from "@melony/ui";

export const mutation = (
  render: (mutation: UseMutationResult<any, any, any>) => React.ReactNode,
  config: Omit<MutationConfig, "type" | "render">
) => {
  return renderUI({
    type: "mutation",
    ...config,
    render,
  });
};
