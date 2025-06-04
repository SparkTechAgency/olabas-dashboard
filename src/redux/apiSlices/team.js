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
      query: () => ({
        url: `/user/team-member`,
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
