"use server";

import apiClient from "../api-client";
import { DEFAULT_LANG } from "../constants";

export const getPointsAction = async ({
  autocomplete,
  lang = DEFAULT_LANG,
}: {
  autocomplete: string;
  lang?: string;
}) => {
  const points = await apiClient.post(
    "/curl/get_points.php",
    {
      login: process.env.API_LOGIN,
      password: process.env.API_PASSWORD,
      autocomplete,
      lang,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json", // this is required for the api to return json response not xml
      },
    }
  );

  return points;
};
