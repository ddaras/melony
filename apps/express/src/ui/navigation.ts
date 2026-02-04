import { ui, UIContract } from "@melony/ui-kit";

const listItemProps = (path: string) => ({
  padding: 'sm',
  onClickAction: {
    type: "client:navigate",
    data: { path },
  },
});

export const navigationUI = ui.box({ paddingHorizontal: "sm" }, [ui.list({
  gap: "none",
  padding: "none",
}, [
  ui.listItem(listItemProps("/") as UIContract["listItem"], [ui.text("Home", { size: "sm" })]),
  ui.listItem(listItemProps("/?tab=skills") as UIContract["listItem"], [ui.text("Skills", { size: "sm" })]),
  ui.listItem(listItemProps("/?tab=settings") as UIContract["listItem"], [ui.text("Settings", { size: "sm" })]),
])]);
