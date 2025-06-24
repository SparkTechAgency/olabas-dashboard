import { api } from "../api/baseApi";

const homeSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    dashboard: builder.query({
      query: (currentMonth) => {
        return {
          url: `/dashboard/${currentMonth}`,
          method: "GET",
          
        };
      },
    }),
    totalUserChart: builder.query({
      query: (year) => {
        return {
          url: `/dashboard/booking/${year}`,
          method: "GET",
         
        };
      },
    }),
    totalRevenueChart: builder.query({
      query: (year) => {
        return {
          url: `/dashboard/revenue/${year}`,
          method: "GET",
         
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
