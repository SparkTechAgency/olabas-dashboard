import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseUrl";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
  }),
  endpoints: () => ({}),
  tagTypes: ["Category", "SubCategory"],
});

export const imageUrl = getBaseUrl();
