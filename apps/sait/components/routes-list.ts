import { vstack } from "melony";
import { routeCard } from "./route-card";
import { useBookingStore } from "@/lib/stores/booking";
import { useRouter } from "next/navigation";

export const routesList = ({ data = [] }: { data: any[] }) => {
  const { setRoute } = useBookingStore();
  const router = useRouter();

  const routes = Array.isArray(data) ? data : [];

  const onClickBuyTicket = ({ route }: { route: any }) => {
    setRoute(route);
    router.push(`/booking/data-entry`);
  };

  return vstack(
    routes.map((route) => routeCard({ route, onClickBuyTicket })),
    {
      className: "w-full gap-2",
    }
  );
};
