import { avatar, chip, table, text } from "melony";

export function peopleList({ people }: { people: any[] }) {
  return table({
    data: people,
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
          return text({
            content: `${row.original.name?.firstName} ${row.original.name?.lastName}`,
          });
        },
      },
      {
        header: "City",
        accessorKey: "city",
      },
      {
        header: "Company",
        accessorKey: "company",
        cell: ({ row }) => {
          return chip(row.original.company?.name);
        },
      },
    ],
  });
}
