import { api } from "../api/baseApi";

const termsAndConditionSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateTermsAndCon: builder.mutation({
      query: ({ termsConditions }) => {
        return {
          url: `/company-cms/terms-conditions`,
          method: "PATCH",
          body: { termsConditions },
        };
      },
      invalidatesTags: ["TermsCondition"], // Add cache invalidation
    }),
    getTermsAndCon: builder.query({
      query: () => {
        return {
          url: "/company-cms",
          method: "GET",
        };
      },
      providesTags: ["TermsCondition"], // Add cache tags
    }),
  }),
});

export const { useUpdateTermsAndConMutation, useGetTermsAndConQuery } =
  termsAndConditionSlice;
