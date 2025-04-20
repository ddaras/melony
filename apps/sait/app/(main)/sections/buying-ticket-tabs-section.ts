import { text } from "melony";
import { searchForm } from "@/components/search-form";
import { tabs } from "melony";

export const buyingTicketTabsSection = ({
  isPending,
  mutate,
}: {
  isPending: boolean;
  mutate: (data: any) => void;
}) => {
  return tabs([
    {
      label: "Search of routes",
      content: searchForm({ isPending, mutate }),
    },
    {
      label: "Seat selection",
      content: text("Seat selection"),
    },
    {
      label: "Payment",
      content: text("Payment"),
      disabled: true,
    },
  ]);
};
