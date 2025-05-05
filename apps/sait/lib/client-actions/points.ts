export const searchPointsClientAction = async ({
  value,
}: {
  value: string;
}) => {
  const res = await fetch("http://localhost:3000/bus-system/search", {
    method: "POST",
    body: JSON.stringify({ autocomplete: value }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  return data;
};
