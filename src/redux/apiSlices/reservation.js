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
      query: ({ page, limit, searchTerm }) => ({
        url: `/booking?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
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
      invalidatesTags: ["RESERVATION"],
    }),

    updateReservationStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/booking/status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["RESERVATION"],
    }),

    getExportData: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/booking/export?createdAt[gte]=${startDate}&createdAt[lte]=${endDate}`,
        method: "GET",
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
  useUpdateReservationStatusMutation,
  useLazyGetExportDataQuery,
} = reservationSlice;
