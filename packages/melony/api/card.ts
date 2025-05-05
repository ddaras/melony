import { renderUI } from "../render/ui";
import { CardConfig } from "../builder/types";

export const card = (config?: Omit<CardConfig, "type">) => {
  return renderUI({
    type: "card",
    ...config,
  });
};
