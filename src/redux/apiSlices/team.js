import { api } from "../api/baseApi";

const teamSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createTeam: builder.mutation({
      query: (data) => ({
        url: "/user/team-member",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Team"],
    }),
    updateTeam: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/user/team-member/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["Team"],
    }),
    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `/user/team-member/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),
    getTeam: builder.query({
      query: ({ page, limit, status }) => ({
        url: `/user/team-member?page=${page}&limit=${limit}${
          status && status !== "all" ? `&status=${status}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["Team"],
    }),
  }),
});

export const {
  useGetTeamQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamSlice;
