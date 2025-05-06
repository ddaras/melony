import { hstack, vstack } from "melony";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export const stackedLayout = ({
  children,
  showSidebar = true,
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
}) => {
  return vstack({
    children: [
      Header(),
      hstack({
        children: [
          showSidebar ? Sidebar() : null,
          vstack({
            children: [children],
            className: `p-20 ${showSidebar ? "ml-64" : ""} w-full`,
          }),
        ],
      }),
    ],
  });
};
