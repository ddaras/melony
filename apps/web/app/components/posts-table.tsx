import { loader, query, table } from "melony";
import { getPostsMockData } from "@/lib/actions/mock-data";

export const postsTable = () =>
  query()
    .action(getPostsMockData)
    .render((query) => {
      if (query.isPending) {
        return loader();
      }

      return table({
        columns: [
          {
            header: "Title",
            accessorKey: "title",
          },
        ],
        data: query.data,
      });
    });
