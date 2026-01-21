import { MENU } from "../data/menu";

export const getMenuAction = async function* () {
  return { menu: MENU };
};
