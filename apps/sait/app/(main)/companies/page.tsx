"use client";

import { getCompaniesTwentyAction } from "@/lib/twenty-actions/companies";
import { heading, query, table, text, vstack } from "melony";

export default function CompaniesPage() {
  return query(
    ({ data, isPending, error }) => {
      console.log(data);

      if (isPending) {
        return text("Loading...");
      }

      return vstack(
        [
          heading("Companies"),
          table(data?.data?.companies || [], {
            columns: [
              {
                header: "Name",
                accessorKey: "name",
              },
              {
                header: "Domain",
                accessorKey: "domainName",
                cell: ({ row }) => {
                  return text(row.original.domainName?.primaryLinkUrl);
                },
              },
            ],
          }),
        ],
        {
          className: "gap-8",
        }
      );
    },
    {
      queryKey: "companies",
      action: getCompaniesTwentyAction,
    }
  );
}
