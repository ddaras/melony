import { vstack } from "melony";
import { hstack } from "melony";
import { sidebar } from "./sidebar";
import { header } from "./header";

export const sidebarLayout = ({
  children,
  pathname,
}: {
  children: React.JSX.Element;
  pathname: string;
}) => {
  const contentStack = vstack()
    .className("w-full h-full p-4 flex-1 overflow-y-auto")
    .child(children);

  const mainStack = hstack()
    .className("w-full h-full flex-1 overflow-hidden")
    .children([sidebar({ pathname }), contentStack]);

  const innerStack = vstack()
    .className("w-full h-full")
    .children([header(), mainStack]);

  return vstack().className("w-full h-screen").child(innerStack);
};
