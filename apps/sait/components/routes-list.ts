import { table } from "melony";

const columns = [
  {
    header: "From",
    accessorKey: "fromCity",
  },
  {
    header: "To",
    accessorKey: "toCity",
  },
  {
    header: "Departure Time",
    accessorKey: "departureTime",
  },
  {
    header: "Arrival Time",
    accessorKey: "arrivalTime",
  },
  {
    header: "Price",
    accessorKey: "price",
  },
  {
    header: "Available Seats",
    accessorKey: "availableSeats",
  },
];

export const routesList = ({ data }: { data: any[] }) =>
  table(data, {
    columns,
  });
