import { hstack, vstack, text } from "melony";

export const cleanLayout = (children: React.JSX.Element) => {
  return vstack()
    .className("h-screen")
    .children([
      hstack()
        .className("h-14 items-center px-4 fixed top-0 left-0 right-0")
        .children([text().content("MentalConnect")]),
      children,
    ]);
};
