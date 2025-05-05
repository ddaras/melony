import { button, card, chip, hstack, text, vstack } from "melony";
import { labeledValue } from "./labeled-value";

export const routeCard = ({
  route,
  onClickBuyTicket,
}: {
  route: any;
  onClickBuyTicket: ({ route }: { route: any }) => void;
}) => {
  return card({
    children: [
      hstack({
        children: [
          vstack({
            className: "w-1/4 gap-4",
            children: [
              chip({
                label: route.carrier,
                className: "truncate",
              }),
              vstack({
                children: [
                  labeledValue("Time From", route.time_from),
                  labeledValue("Time To", route.time_to),
                ],
              }),
              text({
                content: route.route_name,
                className: "text-xs opacity-50",
              }),
            ],
          }),
          vstack({
            className: "w-2/4 gap-4",
            children: [
              ...route?.stations?.departure?.map((point: any) =>
                labeledValue(point.point_name, point.station_name)
              ),
              text({
                content: `Duration: ${route?.time_in_way}`,
                className: "font-bold text-sm italic",
              }),
              vstack({
                children: [
                  ...route?.stations?.arrival?.map((point: any) =>
                    labeledValue(point.point_name, point.station_name)
                  ),
                ],
              }),
            ],
          }),
          vstack({
            className: "w-1/4 gap-4",
            children: [
              labeledValue("Free Seats", route.free_seats.length.toString()),
              vstack({
                className: "gap-1",
                children: [
                  text({
                    content: "Price",
                    className: "text-sm opacity-50",
                  }),
                  text({
                    content: `${route.price_one_way} EUR`,
                    className: "font-bold text-lg",
                  }),
                ],
              }),
              button({
                label: "BUY TICKET",
                className: "mt-auto",
                onClick: () => onClickBuyTicket({ route }),
              }),
            ],
          }),
        ],
        className: "w-full",
      }),
    ],
  });
};
