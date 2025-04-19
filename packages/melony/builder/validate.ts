import { UIConfig } from "./types";

export function validate(config: UIConfig): boolean {
  // Add schema checks, missing props, etc.
  return !!config;
}
