import { ui } from "@melony/ui-kit";
import { threadUI } from "./thread.js";
import { sidebarUI } from "./sidebar.js";

export const layoutUI = ui.row({ height: "full" }, [sidebarUI, threadUI]);