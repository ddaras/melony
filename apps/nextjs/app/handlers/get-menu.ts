import { MENU } from "../data/menu";
import { renderMenuCard } from "../uis/menu-card";
import { FoodEvent, FoodState } from "../agents/types";
import { EventHandler } from "melony";

export const getMenuHandler: EventHandler<FoodState, FoodEvent> = async function* (event) {
  if (event.type !== "action:getMenu") return;

  yield {
    type: "ui",
    data: renderMenuCard(MENU),
  } as FoodEvent;
};
