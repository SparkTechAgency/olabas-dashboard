import { api } from "../api/baseApi";

const adminManagementSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/user/admin", // Fixed endpoint - was pointing to "/vehicle"
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ADMIN"],
    }),
    updateAdmin: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/user/admin/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["ADMIN"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/user/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ADMIN"],
    }),
    getAdmin: builder.query({
      query: () => `/user/admin`,
      providesTags: ["ADMIN"],
    }),
    getAdminById: builder.query({
      query: ({ id }) => `/user/admin/${id}`,
      providesTags: ["ADMIN"],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useUpdateAdminMutation,
  useGetAdminQuery,
  useGetAdminByIdQuery,
} = adminManagementSlice;
