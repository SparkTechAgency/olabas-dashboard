import { api } from "../api/baseApi";

const homeSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    dashboard: builder.query({
      query: () => {
        return {
          url: `/dashboard/2025-06`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
      },
    }),
    totalUserChart: builder.query({
      query: (year) => {
        return {
          url: `/dashboard/booking/${year}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
      },
    }),
    totalRevenueChart: builder.query({
      query: (year) => {
        return {
          url: `/dashboard/revenue/${year}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
      },
    }),
  }),
});

export const {
  useDashboardQuery,
  useTotalRevenueChartQuery,
  useTotalUserChartQuery,
} = homeSlice;
