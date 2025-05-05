import { AvatarConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function avatar(config?: Omit<AvatarConfig, "type">) {
  return renderUI({
    type: "avatar",
    ...config,
  });
}
