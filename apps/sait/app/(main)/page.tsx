"use client";

import { heading, hstack, mutation, tabs, vstack } from "melony";
import { searchForm } from "@/components/search-form";
import { routesList } from "@/components/routes-list";
import { getMockRoutesClientAction } from "@/lib/client-actions/mock-routes";

export default function Home() {
  return mutation(
    ({ data, isPending, mutate }) =>
      vstack(
        [
          hstack([heading("Search of routes")]),
          tabs([
            {
              label: "Search of routes",
              content: searchForm({ isPending, mutate }),
            },
            {
              label: "Seat selection",
              content: <>Select your seat </>,
            },
            {
              label: "Payment",
              content: <>Select your seat </>,
              disabled: true,
            },
          ]),
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
