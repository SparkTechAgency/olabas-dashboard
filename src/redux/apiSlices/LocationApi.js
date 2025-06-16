import { api } from "../api/baseApi";

const LocationAPi = api.injectEndpoints({
  endpoints: (builder) => ({
    createLocation: builder.mutation({
      query: (data) => {
        return {
          url: `/location` /* 
                {
                "location":"Bangladesh, China"
                }
          */,
          method: "POST",
          body: data,
        };
      },
    }),
    getAllLocation: builder.query({
      query: (data) => {
        return {
          url: `/location`,
          method: "GET",
          body: data,
        };
      },
    }),

    getSearchLocation: builder.query({
      query: (search) => {
        return {
          url: `/location?searchTerm=${search}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateLocationMutation,
  useGetSearchLocationQuery,
  useGetAllLocationQuery,
} = LocationAPi;
