import { avatar, table, text } from "melony";

export function peopleList({ people }: { people: any[] }) {
  return table(people, {
    columns: [
      {
        header: "Avatar",
        accessorKey: "avatar",
        size: 64,
        cell: ({ row }) => {
          return avatar(row.original.avatarUrl);
        },
      },
      {
        header: "Name",
        accessorKey: "name",
        size: 340,
        cell: ({ row }) => {
          return text(
            `${row.original.name?.firstName} ${row.original.name?.lastName}`
          );
        },
      },
      {
        header: "City",
        accessorKey: "city",
      },
    ],
  });
}
