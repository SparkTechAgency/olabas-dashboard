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
    }),
    readOne: builder.mutation({
      query: (id) => {
        return {
          url: `/notification/admin/${id}`,
          method: "PATCH",
        };
      },
    }),
    readAll: builder.mutation({
      query: (id) => {
        return {
          url: `/notification/admin`,
          method: "PATCH",
        };
      },
    }),
  }),
});

export const { useNotificationQuery, useReadOneMutation, useReadAllMutation } =
  notificationSlice;
