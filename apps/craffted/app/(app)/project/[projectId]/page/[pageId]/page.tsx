import { getPage } from "@/actions/pages";
import { getWidgets } from "@/actions/widgets";
import { WidgetRenderer } from "@/components/widgets/widget-renderer";
import { heading, vstack } from "melony";

export default async function PagePage({
  params,
}: {
  params: Promise<{ projectId: string; pageId: string }>;
}) {
  const { pageId } = await params;

  const page = await getPage(pageId);
  const widgets = await getWidgets(pageId);

  return vstack({
    className: "mx-auto w-[1000px] my-20 gap-8",
    children: [
      heading({
        content: page.title || "Unknown Page",
        className: "text-2xl font-bold p-2",
      }),
      <div
        key="widgets-grid"
        className="w-full grid grid-cols-4 auto-rows-[160px]"
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className={`
              ${widget.size === "small" && "col-span-1 row-span-1"}
              ${widget.size === "medium" && "col-span-2 row-span-2"}
              ${widget.size === "large" && "col-span-3 row-span-2"}
              ${widget.size === "full" && "col-span-4 row-span-3"}
            `}
          >
            <WidgetRenderer widget={widget} />
          </div>
        ))}
      </div>,
    ],
  });
}
