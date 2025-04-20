"use client";

import { getPeopleTwentyAction } from "@/lib/twenty-actions/people";
import { heading, query, text, vstack } from "melony";
import { peopleList } from "@/components/people-list";

export default function PeoplePage() {
  return query(
    ({ data, isPending, error }) => {
      if (isPending) {
        return text("Loading...");
      }

      return vstack(
        [heading("People"), peopleList({ people: data?.data?.people || [] })],
        {
          className: "gap-8",
        }
      );
    },
    {
      queryKey: "people",
      action: getPeopleTwentyAction,
    }
  );
}
