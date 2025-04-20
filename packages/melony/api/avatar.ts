import { AvatarConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export function avatar(src: string, config?: AvatarConfig) {
  return renderUI({
    type: "avatar",
    src,
    ...config,
  });
}
