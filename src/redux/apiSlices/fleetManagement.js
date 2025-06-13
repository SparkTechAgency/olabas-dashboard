import { api } from "../api/baseApi";

const fleetManagementSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createFleet: builder.mutation({
      query: (data) => ({
        url: "/vehicle",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fleet"],
    }),
    updateFleet: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/vehicle/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["Fleet"],
    }),
    updateFleetStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/vehicle/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Fleet"],
    }),
    deleteFleet: builder.mutation({
      query: (id) => ({
        url: `/vehicle/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Fleet"],
    }),
    getFleet: builder.query({
      query: ({ page, limit }) => `/vehicle/?page=${page}&limit=${limit}`,
      providesTags: ["Fleet"],
    }),

    getFleetById: builder.query({
      query: ({ id }) => `/vehicle/${id}`,
      providesTags: ["Fleet"],
    }),
  }),
});

export const {
  useCreateFleetMutation,
  useDeleteFleetMutation,
  useUpdateFleetMutation,
  useUpdateFleetStatusMutation,
  useGetFleetQuery,
  useGetFleetByIdQuery,
} = fleetManagementSlice;
