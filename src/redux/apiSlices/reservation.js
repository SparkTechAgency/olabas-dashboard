import { api } from "../api/baseApi";

const reservationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createReservation: builder.mutation({
      query: (data) => ({
        url: "/extra-service",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RESERVATION"],
    }),
    updateReservation: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/extra-service/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["RESERVATION"],
    }),
    assignDreiver: builder.mutation({
      query: ({ driverId, rID }) => ({
        url: `/booking/assign-driver/${rID}`,
        method: "PATCH",
        body: { driverId }, // must be an object
      }),
      invalidatesTags: ["RESERVATION"],
    }),

    deleteReservation: builder.mutation({
      query: (id) => ({
        url: `/extra-service/${id}`,
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
  }),
});

export const { useGetReservationQuery, useAssignDreiverMutation } =
  reservationSlice;
