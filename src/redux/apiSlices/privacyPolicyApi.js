import { api } from "../api/baseApi";

const privacyPolicySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updatePricyPolicy: builder.mutation({
      query: ({ privacyPolicy }) => {
        return {
          url: `/company-cms/privacy-policy`,
          method: "PATCH",
          body: { privacyPolicy },
        };
      },
    }),
    privacyPolicy: builder.query({
      query: () => {
        return {
          url: "/company-cms",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useUpdatePricyPolicyMutation, usePrivacyPolicyQuery } =
  privacyPolicySlice;
