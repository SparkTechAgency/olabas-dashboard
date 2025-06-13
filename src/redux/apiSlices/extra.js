import { api } from "../api/baseApi";

const extraSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createExtra: builder.mutation({
      query: (data) => ({
        url: "/extra-service",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Extra"],
    }),
    updateExtra: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/extra-service/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["Extra"],
    }),
    deleteExtra: builder.mutation({
      query: (id) => ({
        url: `/extra-service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Extra"],
    }),
    getExtra: builder.query({
      query: ({ page, limit, status }) => ({
        url: `/extra-service?page=${page}&limit=${limit}${
          status && status !== "ALL" ? `&status=${status}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["Extra"],
    }),
  }),
});

export const {
  useGetExtraQuery,
  useCreateExtraMutation,
  useUpdateExtraMutation,
  useDeleteExtraMutation,
} = extraSlice;
