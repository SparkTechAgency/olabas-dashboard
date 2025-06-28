import { api } from "../api/baseApi";

const conactSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (data) => ({
        url: `/company-cms/contact`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CONTACT"],
    }),

    updateContact: builder.mutation({
      query: ({ data, id }) => ({
        url: `/company-cms/contact/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CONTACT"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/company-cms/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CONTACT"],
    }),

    getContact: builder.query({
      query: () => ({
        url: `/company-cms/contact`,
        method: "GET",
      }),
      providesTags: ["CONTACT"],
    }),

    getContactList: builder.query({
      query: ({ page, limit }) => ({
        url: `/contact?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["CONTACT"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useUpdateContactMutation,
  useGetContactQuery,
  useDeleteContactMutation,
  useGetContactListQuery,
} = conactSlice;
