import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/baseApi";
import carRentalReducer from "./features/ReservationSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    carRental: carRentalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
