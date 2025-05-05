import { hstack, text, vstack } from "melony";
import { header } from "./header";
import { sidebar } from "./sidebar";

export const stackedLayout = ({
  children,
  showSidebar = true,
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
}) => {
  return vstack({
    children: [
      header(),
      hstack({
        children: [
          showSidebar ? sidebar() : null,
          vstack({
            children: [children],
            className: `p-20 ${showSidebar ? "ml-64" : ""} w-full`,
          }),
          // vstack({
          //   children: [text({ content: "Right Sidebar" })],
          //   className: "w-64 p-4",
          // }),
        ],
      }),
    ],
  });
};
