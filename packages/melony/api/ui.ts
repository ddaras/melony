import { UiBuilder } from "../builder/types";
import { renderUI } from "../render/ui";

export function ui(builder: UiBuilder) {
  return renderUI(builder.build());
}
