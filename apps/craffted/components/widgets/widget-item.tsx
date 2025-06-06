import { Widget } from "@/schemas/widgets";
import { button, vstack } from "melony";

export function WidgetItem({ widget }: { widget: Widget }) {
  return vstack({
    children: [button({ label: widget.title })],
  });
}
