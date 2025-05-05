import { searchForm } from "@/components/search-form";

export const buyingTicketTabsSection = ({
  isPending,
  mutate,
}: {
  isPending: boolean;
  mutate: (data: any) => void;
}) => {
  return searchForm({ isPending, mutate });
};
