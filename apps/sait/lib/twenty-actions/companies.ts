export const getCompaniesTwentyAction = async () => {
  const res = await fetch("https://api.twenty.com/rest/companies", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWENTY_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch companies");
  }

  return res.json();
};
