import { ui, UIContract } from "@melony/ui-kit";

const listItemProps = (path: string) => ({
  onClickAction: {
    type: "client:navigate",
    data: { path },
  },
});

export const navigationUI = ui.box({ width: "full" }, [ui.list({
  gap: "none",
}, [
  ui.listItem(listItemProps("/"), [ui.text("Chat", { size: "sm" })]),
  ui.listItem(listItemProps("/?tab=skills") as UIContract["listItem"], [ui.text("Skills", { size: "sm" })]),
])]);
