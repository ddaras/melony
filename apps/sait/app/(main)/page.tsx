"use client";

import { mutation, vstack } from "melony";
import { routesList } from "@/components/routes-list";
import { searchRoutesClientAction } from "@/lib/client-actions/routes";
import { buyingTicketTabsSection } from "./sections/buying-ticket-tabs-section";
import { bookingStepper } from "@/components/booking-stepper";

export default function Home() {
  return mutation({
    action: searchRoutesClientAction,
    render: ({ data, isPending, mutate }) =>
      vstack({
        children: [
          bookingStepper({ activeStep: 0 }),
          buyingTicketTabsSection({ isPending, mutate }),
          routesList({ data }),
        ],
        className: "gap-8",
      }),
  });
}
