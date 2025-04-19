import { vstack } from "melony";
import { header } from "./header";

export const stackedLayout = ({ children }: { children: React.ReactNode }) => {
  return vstack([
    header(),
    vstack([children], {
      className: "container max-w-screen-lg mx-auto p-8",
    }),
  ]);
};
