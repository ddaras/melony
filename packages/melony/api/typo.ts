import { HeadingConfig, TextConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const text = (
  content: string,
  config?: Omit<TextConfig, "type" | "content">
) => {
  return renderUI({
    type: "text",
    content,
    ...config,
  });
};

export const heading = (
  content: string,
  config?: Omit<HeadingConfig, "type" | "content">
) => {
  return renderUI({
    type: "heading",
    content,
    level: config?.level || 1,
    ...config,
  });
};
