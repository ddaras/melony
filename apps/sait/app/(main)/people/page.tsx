"use client";

import { getPeopleTwentyAction } from "@/lib/twenty-actions/people";
import {
  heading,
  query,
  text,
  vstack,
  hstack,
  button,
  mutation,
  modalButton,
} from "melony";
import { peopleList } from "@/components/people-list";
import { addPersonForm } from "@/components/add-person-form";

export default function PeoplePage() {
  return query(
    ({ data, isPending, error }) => {
      if (isPending) {
        return text("Loading...");
      }

      return vstack(
        [
          hstack(
            [
              heading("People"),
              modalButton("Add Person", {
                title: "New Person",
                description: "Add a new person to the list",
                content: mutation(addPersonForm, {
                  action: async (data) => {
                    console.log(data);
                  },
                }),
              }),
            ],
            {
              className: "justify-between",
            }
          ),
          peopleList({ people: data?.data?.people || [] }),
        ],
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
