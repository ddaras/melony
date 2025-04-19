export const getMockPointsClientAction = async ({
  value,
}: {
  value: string;
}) => {
  const points = [
    {
      point_id: "route1",
      point_name: "New York",
    },
    {
      point_id: "route2",
      point_name: "Boston",
    },
  ];

  if (value) {
    return Promise.resolve(
      points.filter((point) => point.point_name.includes(value))
    );
  }

  return Promise.resolve(points);
};
