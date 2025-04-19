export const getMockRoutesClientAction = async (data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      id: "route1",
      fromCity: "New York",
      toCity: "Boston",
      departureTime: "09:00",
      arrivalTime: "13:00",
      price: 45.99,
      availableSeats: 32,
    },
    {
      id: "route2",
      fromCity: "New York",
      toCity: "Boston",
      departureTime: "11:30",
      arrivalTime: "15:30",
      price: 39.99,
      availableSeats: 28,
    },
    {
      id: "route3",
      fromCity: "Boston",
      toCity: "New York",
      departureTime: "10:00",
      arrivalTime: "14:00",
      price: 42.99,
      availableSeats: 45,
    },
    {
      id: "route4",
      fromCity: "Boston",
      toCity: "New York",
      departureTime: "15:00",
      arrivalTime: "19:00",
      price: 37.99,
      availableSeats: 52,
    },
  ];
};
