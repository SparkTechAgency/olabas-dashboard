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
    }),
    getTermsAndCon: builder.query({
      query: () => {
        return {
          url: "/company-cms",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useUpdateTermsAndConMutation, useGetTermsAndConQuery } =
  termsAndConditionSlice;
