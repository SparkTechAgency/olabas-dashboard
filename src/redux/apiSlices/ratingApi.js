import { api } from "../api/baseApi";

const ratingSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createRating: builder.mutation({
      query: (data) => ({
        url: "/review/admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["REVIEW"],
    }),

    deleteRating: builder.mutation({
      query: (id) => ({
        url: `/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["REVIEW"],
    }),

    getRating: builder.query({
      query: ({ page, limit }) => `/review?page=${page}&limit=${limit}`,
      providesTags: ["REVIEW"],
    }),
  }),
});

export const {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useGetRatingQuery,
} = ratingSlice;
