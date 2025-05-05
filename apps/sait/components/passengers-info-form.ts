import {
  button,
  card,
  form,
  formDateField,
  formTextField,
  hstack,
  mutation,
  spacer,
  toast,
} from "melony";
import { useBookingStore } from "@/lib/stores/booking";
import { useRouter } from "next/navigation";
import { createBookingClientAction } from "@/lib/client-actions/booking";
import { Passenger } from "@/lib/types/passenger";

const passengerInfo = (index: number) => {
  return hstack({
    className: "gap-4",
    children: [
      formTextField({
        name: `passengers[${index}].name`,
      }),
      formTextField({
        name: `passengers[${index}].surname`,
      }),
      formDateField({
        name: `passengers[${index}].birth_date`,
      }),
    ],
  });
};

export const passengersInfoForm = ({
  passengersCount,
}: {
  passengersCount: number;
}) => {
  const router = useRouter();
  const {
    route,
    passengers,
    setPassengers,
    setContacts,
    contacts,
    setOrderResponse,
  } = useBookingStore();

  console.log("route", route);

  return mutation({
    action: createBookingClientAction,
    onSuccess: (data) => {
      setPassengers(data?.passengers || []);
      setContacts(data?.contacts || {});
      setOrderResponse(data?.orderResponse || null);
      router.push("/booking/payment");
    },
    onError: (error) => {
      toast("Failed to submit passengers info", {
        variant: "error",
      });
    },
    render: ({ mutate, isPending }) =>
      card({
        className: "gap-8",
        children: [
          form({
            defaultValues: {
              passengers: passengers,
              contacts: contacts,
            },
            onSubmit: (data) => {
              mutate({
                date: [route?.date_from],
                interval_id: [route?.interval_id],
                name: data.passengers.map(
                  (passenger: Passenger) => passenger.name
                ),
                surname: data.passengers.map(
                  (passenger: Passenger) => passenger.surname
                ),
                phone: data.contacts.phone,
                email: data.contacts.email,
                seat: Array.from({ length: passengersCount }, () => [
                  route?.free_seats[
                    Math.floor(Math.random() * route?.free_seats.length)
                  ],
                ]),
              });
            },
            children: [
              ...Array.from({ length: passengersCount }, (_, index) =>
                passengerInfo(index)
              ),

              spacer(),

              formTextField({
                name: "contacts.email",
              }),
              formTextField({
                name: "contacts.phone",
              }),

              button({
                label: "Submit Passengers Info",
                isLoading: isPending,
                submit: true,
              }),
            ],
          }),
        ],
      }),
  });
};
