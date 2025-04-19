import { TabConfig, TabsConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const tabs = (tabs: TabConfig[], config?: Omit<TabsConfig, "type">) => {
  return renderUI({
    type: "tabs",
    tabs,
    ...config,
  });
};
