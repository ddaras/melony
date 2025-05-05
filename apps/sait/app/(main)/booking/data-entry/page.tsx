"use client";

import { bookingStepper } from "@/components/booking-stepper";
import { passengersInfoForm } from "@/components/passengers-info-form";
import { button, vstack } from "melony";
import { useRouter } from "next/navigation";

export default function BookingSeatsPage() {
  const router = useRouter();

  return vstack({
    className: "gap-8",
    children: [
      bookingStepper({ activeStep: 1 }),
      button({
        label: "Back",
        variant: "ghost",
        onClick: () => router.back(),
      }),
      passengersInfoForm({
        passengersCount: 2,
      }),
    ],
  });
}
