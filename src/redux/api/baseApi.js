import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/baseUrl";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "RESERVATION",
    "DRIVER",
    "VEHICLE",
    "USER",
    "PAYMENT",
    "CONTACT",
    "EXTRA",
    "FAQ",
    "FLEET",
    "MANAGER",
    "NOTIFICATION",
    "TEAM",
    "REVIEW",
  ],
});

export const imageUrl = getBaseUrl();
