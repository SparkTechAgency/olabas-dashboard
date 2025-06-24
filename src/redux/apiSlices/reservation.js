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
      providesTags: ["RESERVATION"],
    }),

    updateReservationStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/booking/status/${id}`,
        method: "PATCH",
        body: data,
      }),
      providesTags: ["RESERVATION"],
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

// import { api } from "../api/baseApi";

// const reservationSlice = api.injectEndpoints({
//   endpoints: (builder) => ({
//     assignDreiver: builder.mutation({
//       query: ({ driverId, rID }) => ({
//         url: `/booking/assign-driver/${rID}`,
//         method: "PATCH",
//         body: { driverId: driverId },
//       }),
//       invalidatesTags: ["RESERVATION"],
//     }),

//     deleteReservation: builder.mutation({
//       query: (id) => ({
//         url: `/booking/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["RESERVATION"],
//     }),

//     getReservation: builder.query({
//       query: ({ page, limit, searchTerm }) => {
//         // Build query params
//         let queryParams = `page=${page}&limit=${limit}`;

//         // Add search term if it exists and is not empty
//         if (searchTerm && searchTerm.trim()) {
//           queryParams += `&searchTerm=${encodeURIComponent(searchTerm.trim())}`;
//         }

//         return {
//           url: `/booking?${queryParams}`,
//           method: "GET",
//         };
//       },
//       providesTags: ["RESERVATION"],
//     }),

//     createReservation: builder.mutation({
//       query: (data) => ({
//         url: `/booking`,
//         method: "POST",
//         body: data,
//       }),
//       providesTags: ["RESERVATION"],
//     }),

//     updateReservationStatus: builder.mutation({
//       query: ({ id, data }) => ({
//         url: `/booking/status/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       providesTags: ["RESERVATION"],
//     }),

//     getExportData: builder.query({
//       query: ({ startDate, endDate, searchTerm }) => {
//         // Build query params for export
//         let queryParams = `createdAt[gte]=${startDate}&createdAt[lte]=${endDate}`;

//         // Add search term to export query if it exists
//         if (searchTerm && searchTerm.trim()) {
//           queryParams += `&searchTerm=${encodeURIComponent(searchTerm.trim())}`;
//         }

//         return {
//           url: `/booking/export?${queryParams}`,
//           method: "GET",
//         };
//       },
//       providesTags: ["RESERVATION"],
//     }),
//   }),
// });

// export const {
//   useAssignDreiverMutation,
//   useDeleteReservationMutation,
//   useGetReservationQuery,
//   useCreateReservationMutation,
//   useUpdateReservationStatusMutation,
//   useLazyGetExportDataQuery,
// } = reservationSlice;
