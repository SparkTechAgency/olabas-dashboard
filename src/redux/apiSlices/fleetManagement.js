import { api } from "../api/baseApi";

const fleetManagementSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createFleet: builder.mutation({
      query: (data) => ({
        url: "/vehicle",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FLEET"],
    }),
    updateFleet: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/vehicle/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["FLEET"],
    }),
    updateFleetStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/vehicle/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["FLEET"],
    }),
    deleteFleet: builder.mutation({
      query: (id) => ({
        url: `/vehicle/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FLEET"],
    }),
    getFleet: builder.query({
      query: ({ page, limit }) => `/vehicle/admin?page=${page}&limit=${limit}`,
      providesTags: ["FLEET"],
    }),
    getAvailableFleet: builder.query({
      query: ({ page, limit }) => `/vehicle?page=${page}&limit=${limit}`,
      providesTags: ["FLEET"],
    }),

    getFleetById: builder.query({
      query: ({ id }) => `/vehicle/${id}`,
      providesTags: ["FLEET"],
    }),
  }),
});

export const {
  useCreateFleetMutation,
  useDeleteFleetMutation,
  useUpdateFleetMutation,
  useUpdateFleetStatusMutation,
  useGetFleetQuery,
  useGetAvailableFleetQuery,
  useGetFleetByIdQuery,
} = fleetManagementSlice;
