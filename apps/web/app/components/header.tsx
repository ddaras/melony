import { navigationButton, hstack } from "melony";

export const header = () => {
  return hstack()
    .className("w-full h-14 border-b p-2")
    .children([
      navigationButton()
        .label("MentalConnect")
        .href("/")
        .variant("ghost")
        .className("font-bold"),
    ]);
};
