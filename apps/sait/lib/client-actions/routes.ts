export const searchRoutesClientAction = async (data: {
  from: string;
  to: string;
  date: string;
}) => {
  const response = await fetch("http://localhost:3000/bus-system/routes", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};
