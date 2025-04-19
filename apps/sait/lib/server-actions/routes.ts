"use server";

import apiClient from "@/lib/api-client";

export interface RouteParams {
  date: string;
  id_from: string;
  id_to: string;
  trans: string;
  change: string;
  currency: string;
  lang: string;
  v: string;
}

export const getRoutesAction = async ({
  date = new Date().toISOString().split("T")[0],
  id_from,
  id_to,
  trans = "bus",
  change = "auto",
  currency = "EUR",
  lang = "en",
  v = "1.1",
}: RouteParams) => {
  const routes = await apiClient.post(
    "/curl/get_routes.php",
    {
      login: process.env.API_LOGIN,
      password: process.env.API_PASSWORD,
      date,
      id_from,
      id_to,
      trans,
      change,
      currency,
      lang,
      v,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  return routes;
};
