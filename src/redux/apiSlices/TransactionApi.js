// src/api/termsAndConditionSlice.js or wherever your api slice is
import { api } from "../api/baseApi";

const termsAndConditionSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransaction: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/payment/admin`,
        method: "GET",
        params: { page, limit }, // Send page and limit as query params
      }),
    }),
  }),
});

export const { useGetTransactionQuery } = termsAndConditionSlice;
