import { RouteParams } from "../server-actions/routes";

export const getRoutesClientAction = async (data: RouteParams) => {
  const response = await fetch("/api/v1/routes", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};
