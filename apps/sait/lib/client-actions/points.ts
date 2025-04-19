export const getPointsClientAction = async ({ value }: { value: string }) => {
  const res = await fetch("/api/v1/points", {
    method: "POST",
    body: JSON.stringify({ autocomplete: value }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  return data;
};
