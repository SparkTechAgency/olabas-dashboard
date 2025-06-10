// Updated API Slice (driverManagementApi.js)
import { api } from "../api/baseApi";

const driverSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createDriver: builder.mutation({
      query: (data) => ({
        url: "/user/driver",
        method: "POST",
        body: data, // FormData will be sent as-is
      }),
      invalidatesTags: ["DRIVER"],
    }),
    updateDriver: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/user/driver/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["DRIVER"],
    }),
    deleteDriver: builder.mutation({
      query: (id) => ({
        url: `/user/driver/${id}`,
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
    getParticularDriver: builder.query({
      query: (id) => ({
        url: `/user/driver/${id}`,
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
  }),
});

export const {
  useGetDriverQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
  useGetParticularDriverQuery,
} = driverSlice;
