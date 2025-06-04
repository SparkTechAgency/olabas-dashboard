import { api } from "../api/baseApi";

const conactSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateContact: builder.mutation({
      query: ({ updatedData }) => ({
        url: `/company-cms/contact`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["Contact"],
    }),

    getContact: builder.query({
      query: () => ({
        url: `/company-cms/contact`,
        method: "GET",
      }),
      providesTags: ["Contact"],
    }),
  }),
});

export const { useUpdateContactMutation, useGetContactQuery } = conactSlice;
