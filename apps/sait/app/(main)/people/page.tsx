"use client";

import { getPeopleTwentyAction } from "@/lib/twenty-actions/people";
import {
  heading,
  query,
  text,
  vstack,
  hstack,
  mutation,
  modalButton,
  toast,
} from "melony";
import { peopleList } from "@/components/people-list";
import { addPersonForm } from "@/components/add-person-form";

export default function PeoplePage() {
  return query({
    queryKey: "people",
    action: getPeopleTwentyAction,
    render: ({ data, isPending, error }) => {
      if (isPending) {
        return text({ content: "Loading..." });
      }

      return vstack({
        className: "gap-8",
        children: [
          hstack({
            className: "justify-between",
            children: [
              heading({ content: "People" }),
              modalButton({
                label: "Add Person",
                title: "New Person",
                description: "Add a new person to the list",
                content: ({ close }) =>
                  mutation({
                    action: async (data) => {
                      console.log(data);

                      await new Promise((resolve) => setTimeout(resolve, 1000));
                    },
                    render: addPersonForm,
                    onSuccess: () => {
                      close();
                      toast("Person added successfully");
                    },
                    onError: () => {
                      toast("Error adding person", {
                        description: "Please try again",
                        variant: "error",
                      });
                    },
                  }),
              }),
            ],
          }),
          peopleList({ people: data?.data?.people || [] }),
        ],
      });
    },
  });
}
