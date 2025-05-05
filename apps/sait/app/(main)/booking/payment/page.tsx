"use client";

import { bookingStepper } from "@/components/booking-stepper";
import { useBookingStore } from "@/lib/stores/booking";
import { button, card, heading, text, vstack } from "melony";
import { useRouter } from "next/navigation";

export default function BookingPaymentPage() {
  const router = useRouter();

  const { route, passengers, contacts, orderResponse } = useBookingStore();

  console.log("route", route);
  console.log("passengers", passengers);
  console.log("contacts", contacts);
  console.log("orderResponse", orderResponse);

  return vstack({
    className: "gap-8",
    children: [
      bookingStepper({ activeStep: 2 }),
      button({
        label: "Back",
        variant: "ghost",
        onClick: () => router.back(),
      }),
      card({
        className: "flex flex-col gap-4",
        children: [
          heading({ content: "Route" }),
          text({ content: JSON.stringify(route) }),
          heading({ content: "Passengers" }),
          text({ content: JSON.stringify(passengers) }),
          heading({ content: "Contacts" }),
          text({ content: JSON.stringify(contacts) }),
        ],
      }),
    ],
  });
}
