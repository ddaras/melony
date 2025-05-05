import { stepper } from "melony";

export function bookingStepper({ activeStep }: { activeStep: number }) {
  return stepper({
    steps: [
      { title: "Search of routes" },
      { title: "Data entry" },
      { title: "Payment" },
    ],
    activeStep,
  });
}
