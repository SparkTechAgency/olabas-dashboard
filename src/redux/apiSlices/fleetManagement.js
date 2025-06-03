import { api } from "../api/baseApi";

const fleetManagementSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createFleet: builder.mutation({
      query: (categoryData) => {
        return {
          url: "/subcategories/create-subcategory",
          method: "POST",
          body: categoryData,
        };
      },
      invalidatesTags: ["SubCategory"],
    }),
    updateFleet: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/categories/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["SubCategory"],
    }),
    deleteFleet: builder.mutation({
      query: (id) => {
        return {
          url: `/categories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["SubCategory"],
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
