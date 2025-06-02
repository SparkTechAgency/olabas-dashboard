import { api } from "../api/baseApi";
const resetToken = localStorage.getItem("resetToken");
const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/verify-email",
          body: data,
        };
      },
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
      transformResponse: (data) => {
        return data;
      },
      transformErrorResponse: ({ data }) => {
        const { message } = data;
        return message;
      },
    }),
    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/forget-password",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ newPassword, confirmPassword, token }) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: { newPassword, confirmPassword },
          headers: {
            Authorization: token,
          },
        };
      },
    }),

    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/change-password",
          body: data,
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
    }),

    updateProfile: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/update-profile",
          body: data,
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
    }),

    profile: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/auth/get-profile",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
      transformResponse: ({ user }) => {
        return user;
      },
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} = authSlice;
