import { StepperConfig } from "../builder/types";
import { renderUI } from "../render/ui";

export const stepper = (config?: Omit<StepperConfig, "type">) => {
  return renderUI({ type: "stepper", steps: config?.steps || [], ...config });
};
