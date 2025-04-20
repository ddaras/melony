"use client";

import { heading, hstack, mutation, vstack } from "melony";
import { routesList } from "@/components/routes-list";
import { getMockRoutesClientAction } from "@/lib/client-actions/mock-routes";
import { buyingTicketTabsSection } from "./sections/buying-ticket-tabs-section";

export default function Home() {
  return mutation(
    ({ data, isPending, mutate }) =>
      vstack(
        [
          hstack([heading("Search of routes")]),
          buyingTicketTabsSection({ isPending, mutate }),
          routesList({ data }),
        ],
        {
          className: "gap-8",
        }
      ),
    {
      action: getMockRoutesClientAction,
    }
  );
}
