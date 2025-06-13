import { api } from "../api/baseApi";

const clientManagementSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getClient: builder.query({
      query: ({ page, limit, searchTerm }) => {
        return {
          url: `/client?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
          // url: `/client`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetClientQuery } = clientManagementSlice;
