import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/baseApi";
import carRentalReducer from "./features/ReservationSlice";
import Profile from "./features/ProfileSlice";
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    carRental: carRentalReducer,
    profile: Profile,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
