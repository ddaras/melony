import { HeadingConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const heading = (config?: Omit<HeadingConfig, "type">) => {
  return renderUI({
    type: "heading",
    content: config?.content || "Heading",
    variant: config?.variant || "h1",
    ...config,
  });
};
