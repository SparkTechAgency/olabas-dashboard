import { api } from "../api/baseApi";

const managerManagementSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createManager: builder.mutation({
      query: (data) => ({
        url: "/user/manager",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MANAGER"],
    }),
    updateManager: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/user/manager/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["MANAGER"],
    }),
    deleteManager: builder.mutation({
      query: (id) => ({
        url: `/user/manager/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MANAGER"],
    }),
    getManager: builder.query({
      query: () => `/user/manager`,
      providesTags: ["MANAGER"],
    }),
    getManagerById: builder.query({
      query: ({ id }) => `/user/manager/${id}`,
      providesTags: ["MANAGER"],
    }),
  }),
});

export const {
  useCreateManagerMutation,
  useDeleteManagerMutation,
  useUpdateManagerMutation,
  useGetManagerQuery,
  useGetManagerByIdQuery,
} = managerManagementSlice;
