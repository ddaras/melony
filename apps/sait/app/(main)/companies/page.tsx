"use client";

import { getCompaniesTwentyAction } from "@/lib/twenty-actions/companies";
import { heading, query, table, text, vstack } from "melony";

export default function CompaniesPage() {
  return query({
    queryKey: "companies",
    action: getCompaniesTwentyAction,
    render: ({ data, isPending, error }) => {
      console.log(data);

      if (isPending) {
        return text({ content: "Loading..." });
      }

      return vstack({
        className: "gap-8",
        children: [
          heading({ content: "Companies" }),
          table({
            data: data?.data?.companies,
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
      });
    },
  });
}
