import { TabsConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const tabs = (config?: Omit<TabsConfig, "type">) => {
  return renderUI({
    type: "tabs",
    tabs: config?.tabs || [],
    ...config,
  });
};
