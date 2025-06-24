import { api } from "../api/baseApi";

const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    notification: builder.query({
      query: () => {
        return {
          url: `/notification/admin`,
          method: "GET",
        };
      },
      providesTags: ["NOTIFICATION"],
    }),
    readOne: builder.mutation({
      query: (id) => {
        return {
          url: `/notification/admin/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["NOTIFICATION"],
    }),
    readAll: builder.mutation({
      query: (id) => {
        return {
          url: `/notification/admin`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["NOTIFICATION"],
    }),
  }),
});

export const { useNotificationQuery, useReadOneMutation, useReadAllMutation } =
  notificationSlice;
