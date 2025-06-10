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

    getSearchLocation: builder.query({
      query: (search) => {
        return {
          url: `/location?searchTerm=${search}` /* 
              {
    "success": true,
    "message": "Locations retrieved successfully",
    "data": {
        "meta": {
            "total": 4,
            "limit": 10,
            "page": 1,
            "totalPage": 1
        },
        "result": [
            {
                "_id": "6842d7bf8253ea7861f08724",
                "location": "ptronab",
                "createdAt": "2025-06-06T11:57:51.884Z",
                "updatedAt": "2025-06-06T11:57:51.884Z"
            },
            {
                "_id": "6842d7ab8253ea7861f08722",
                "location": "Bangladesh, China",
                "createdAt": "2025-06-06T11:57:31.525Z",
                "updatedAt": "2025-06-06T11:57:31.525Z"
            },
            {
                "_id": "6836f98ad89cc068ae80cbe5",
                "location": "Inidra Varat",
                "createdAt": "2025-05-28T11:54:50.625Z",
                "updatedAt": "2025-05-28T11:54:50.625Z"
            },
            {
                "_id": "6836f97cd89cc068ae80cbe3",
                "location": "USA, Bangladesh, China",
                "createdAt": "2025-05-28T11:54:36.595Z",
                "updatedAt": "2025-05-28T11:54:36.595Z"
            }
        ]
    }
}
          */,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useCreateLocationMutation, useGetSearchLocationQuery } =
  LocationAPi;
