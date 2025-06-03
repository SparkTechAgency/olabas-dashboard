import { api } from "../api/baseApi";

const homeSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    dashboard: builder.query({
      query: () => {
        return {
          url: `/dashboard`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
      },
    }),
  }),
});

export const { useDashboardQuery } = homeSlice;
