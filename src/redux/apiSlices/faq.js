import { api } from "../api/baseApi";

const faqSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createFaq: builder.mutation({
      query: (data) => ({
        url: "/company-cms/faq",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),
    updateFaq: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/company-cms/faq/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["FAQ"],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/company-cms/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQ"],
    }),
    getFaq: builder.query({
      query: () => ({
        url: `/company-cms/faq`,
        method: "GET",
      }),
      providesTags: ["FAQ"],
    }),
  }),
});

export const {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqQuery,
  useUpdateFaqMutation,
} = faqSlice;
