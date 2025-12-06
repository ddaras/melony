import { MelonyRuntime } from "./runtime";
import { Runtime, RuntimeConfig } from "@melony/core";

export const defineRuntime = (config: RuntimeConfig): Runtime => {
  return new MelonyRuntime(config);
};
