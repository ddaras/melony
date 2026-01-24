import { MENU } from "../data/menu";
import { renderMenuCard } from "../uis/menu-card";
import { FoodEvent, FoodState } from "../agents/types";
import { EventHandler } from "melony";

export const getMenuHandler: EventHandler<FoodState, FoodEvent> = async function* (event) {
  yield {
    type: "ui",
    data: renderMenuCard(MENU),
  };

  yield {
    type: "action:after",
    data: {
      action: "getMenu",
      result: {
        success: true,
        message: "Menu fetched successfully",
      },
    },
  };
};
