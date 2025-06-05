import { api } from "../api/baseApi";

const driverSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createDriver: builder.mutation({
      query: (data) => ({
        url: "/extra-service",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DRIVER"],
    }),
    updateDriver: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/extra-service/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["DRIVER"],
    }),
    deleteDriver: builder.mutation({
      query: (id) => ({
        url: `/extra-service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DRIVER"],
    }),
    getDriver: builder.query({
      query: () => ({
        url: `/user/driver`,
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
  }),
});

export const { useGetDriverQuery } = driverSlice;
