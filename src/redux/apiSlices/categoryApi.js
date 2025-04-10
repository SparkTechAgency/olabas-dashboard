import { api } from "../api/baseApi";

const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (categoryData) => {
        return {
          url: "/categories/create-category",
          method: "POST",
          body: categoryData,
        };
      },
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/categories/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/categories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Category"],
    }),
    category: builder.query({
      query: () => {
        return {
          url: "/categories",
          method: "GET",
        };
      },
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
