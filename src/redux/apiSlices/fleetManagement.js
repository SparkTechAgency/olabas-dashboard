import { api } from "../api/baseApi";

const fleetManagementSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createFleet: builder.mutation({
      query: (data) => {
        const accessToken = localStorage.getItem("accessToken");
        return {
          url: "/vehicle",
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["Fleet"],
    }),
    updateFleet: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/categories/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["Fleet"],
    }),
    deleteFleet: builder.mutation({
      query: (id) => {
        return {
          url: `/categories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Fleet"],
    }),
    getFleet: builder.query({
      query: () => {
        return {
          url: "/vehicle",
          method: "GET",
        };
      },
      providesTags: ["Fleet"],
    }),
  }),
});

export const {
  useCreateFleetMutation,
  useDeleteFleetMutation,
  useUpdateFleetMutation,
  useGetFleetQuery,
} = fleetManagementSlice;
