import { hstack, vstack } from "melony";
import { header } from "./header";
import { sidebar } from "./sidebar";

export const sidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return vstack({
    className: "h-screen",
    children: [
      header(),
      hstack({
        children: [
          sidebar(),
          vstack({
            children: [children],
            className: "flex-1 p-4",
          }),
        ],
        className: "w-full h-full",
      }),
    ],
  });
};
