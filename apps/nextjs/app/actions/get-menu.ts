import { MENU } from "../data/menu";
import { renderMenuCard } from "../uis/menu-card";
import { FoodEvent } from "../agents/types";

export const getMenuAction = async function* () {
  yield {
    type: "ui",
    data: renderMenuCard(MENU),
  } as FoodEvent;

  return { success: true, message: "Menu fetched successfully" };
};
