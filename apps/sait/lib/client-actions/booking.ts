import { Order } from "../types/booking";

export async function createBookingClientAction(data: Order) {
  const res = await fetch("http://localhost:3000/bus-system/booking", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create booking");
  }

  const response = await res.json();

  return response;
}
