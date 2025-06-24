import { api } from "../api/baseApi";

const teamSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createTeam: builder.mutation({
      query: (data) => ({
        url: "/user/team-member",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TEAM"],
    }),
    updateTeam: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/user/team-member/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["TEAM"],
    }),
    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `/user/team-member/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TEAM"],
    }),
    getTeam: builder.query({
      query: ({ page, limit, status }) => ({
        url: `/user/team-member?page=${page}&limit=${limit}${
          status && status !== "all" ? `&status=${status}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["TEAM"],
    }),
  }),
});

export const {
  useGetTeamQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamSlice;
