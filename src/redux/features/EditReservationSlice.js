import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Booking basic info
  bookingId: null,
  status: null,
  amount: null,
  carRentedForInDays: null,
  isPaid: false,
  paymentMethod: null,

  // Pickup and Return
  pickupDate: null,
  pickupTime: null,
  pickupLocation: null,
  returnDate: null,
  returnTime: null,
  returnLocation: null,

  // Vehicle info
  vehicle: null,
  vehicleType: null,

  // Services
  extraServices: [],
  protectionServices: [],

  // Client details
  clientId: null,
  clientInfo: {
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    parmanentAddress: null,
    presentAddress: null,
    country: null,
    state: null,
    postCode: null,
  },

  // Payment info
  paymentId: null,
  driverId: null,

  // Loading states
  isLoading: false,
  error: null,
};

const EditReservationSlice = createSlice({
  name: "editReservation",
  initialState,
  reducers: {
    // Set the entire reservation data
    setReservationData: (state, action) => {
      const data = action.payload;

      // Basic booking info
      state.bookingId = data._id;
      state.status = data.status;
      state.amount = data.amount;
      state.carRentedForInDays = data.carRentedForInDays;
      state.isPaid = data.isPaid;
      state.paymentMethod = data.paymentMethod;

      // Pickup and Return
      state.pickupDate = data.pickupDate;
      state.pickupTime = data.pickupTime;
      state.pickupLocation = data.pickupLocation;
      state.returnDate = data.returnDate;
      state.returnTime = data.returnTime;
      state.returnLocation = data.returnLocation;

      // Vehicle
      state.vehicle = data.vehicle;
      state.vehicleType = data.vehicleType;

      // Services
      state.extraServices = data.extraServices || [];

      // Client info
      state.clientId = data.clientId?._id || data.clientId;
      if (data.clientId && typeof data.clientId === "object") {
        state.clientInfo = {
          firstName: data.clientId.firstName,
          lastName: data.clientId.lastName,
          email: data.clientId.email,
          phone: data.clientId.phone,
          parmanentAddress: data.clientId.parmanentAddress,
          presentAddress: data.clientId.presentAddress,
          country: data.clientId.country,
          state: data.clientId.state,
          postCode: data.clientId.postCode,
        };
      }

      // Payment and driver
      state.paymentId = data.paymentId;
      state.driverId = data.driverId;
    },

    // Update pickup and return info
    updatePickupReturn: (state, action) => {
      const {
        pickupDate,
        pickupTime,
        pickupLocation,
        returnDate,
        returnTime,
        returnLocation,
      } = action.payload;
      state.pickupDate = pickupDate || state.pickupDate;
      state.pickupTime = pickupTime || state.pickupTime;
      state.pickupLocation = pickupLocation || state.pickupLocation;
      state.returnDate = returnDate || state.returnDate;
      state.returnTime = returnTime || state.returnTime;
      state.returnLocation = returnLocation || state.returnLocation;
    },

    // Update vehicle info
    updateVehicle: (state, action) => {
      const { vehicle, vehicleType } = action.payload;
      state.vehicle = vehicle || state.vehicle;
      state.vehicleType = vehicleType || state.vehicleType;
    },

    // Update extra services
    updateExtraServices: (state, action) => {
      state.extraServices = action.payload;
    },

    // Update protection services
    updateProtectionServices: (state, action) => {
      state.protectionServices = action.payload;
    },

    // Update client details
    updateClientDetails: (state, action) => {
      state.clientInfo = { ...state.clientInfo, ...action.payload };
    },

    // Update single field
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear all data
    clearReservationData: (state) => {
      return initialState;
    },
  },
});

export const {
  setReservationData,
  updatePickupReturn,
  updateVehicle,
  updateExtraServices,
  updateProtectionServices,
  updateClientDetails,
  updateField,
  setLoading,
  setError,
  clearReservationData,
} = EditReservationSlice.actions;

export default EditReservationSlice.reducer;
