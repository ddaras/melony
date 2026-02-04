import { ui } from "@melony/ui-kit";
import { navigationUI } from "./navigation.js";

export const sidebarUI = ui.box({
  width: 240,
  height: "full",
}, [
  ui.box({ paddingVertical: "sm", paddingHorizontal: "md" }, [ui.text("OpenBot", { size: "sm", weight: "bold" })]),
  navigationUI,
]);