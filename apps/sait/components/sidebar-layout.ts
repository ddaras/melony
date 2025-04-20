import { hstack, vstack } from "melony";
import { header } from "./header";
import { sidebar } from "./sidebar";

export const sidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return vstack(
    [
      header(),
      hstack([sidebar(), vstack([children], { className: "flex-1 p-4" })], {
        className: "w-full h-full",
      }),
    ],
    {
      className: "h-screen",
    }
  );
};
