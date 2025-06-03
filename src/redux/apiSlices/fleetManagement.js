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
        const accessToken = localStorage.getItem("accessToken");
        return {
          url: `/vehicle/${id}`,
          method: "PATCH",
          body: updatedData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["Fleet"],
    }),
    deleteFleet: builder.mutation({
      query: (id) => {
        const accessToken = localStorage.getItem("accessToken");
        return {
          url: `/vehicle/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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
