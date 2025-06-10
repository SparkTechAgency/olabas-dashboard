import { api } from "../api/baseApi";

const reservationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    assignDreiver: builder.mutation({
      query: ({ driverId, rID }) => ({
        url: `/booking/assign-driver/${rID}`,
        method: "PATCH",
        body: { driverId: driverId },
      }),
      invalidatesTags: ["RESERVATION"],
    }),

    deleteReservation: builder.mutation({
      query: (id) => ({
        url: `/booking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RESERVATION"],
    }),

    getReservation: builder.query({
      query: () => ({
        url: `/booking`,
        method: "GET",
      }),
      providesTags: ["RESERVATION"],
    }),

    createReservation: builder.mutation({
      query: (data) => ({
        url: `/booking`,
        method: "POST",
        body: data,
      }),
      providesTags: ["RESERVATION"],
    }),
  }),
});

export const {
  useAssignDreiverMutation,
  useDeleteReservationMutation,
  useGetReservationQuery,
  useCreateReservationMutation,
} = reservationSlice;
