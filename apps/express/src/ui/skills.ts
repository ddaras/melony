import { ui } from "@melony/ui-kit";

export const skillsUI = ui.box({
  padding: "md",
}, [
  ui.heading("Skills", { level: 2 }),
  ui.text("The skills for the OpenBot", { size: "sm", color: "mutedForeground" }),
]);